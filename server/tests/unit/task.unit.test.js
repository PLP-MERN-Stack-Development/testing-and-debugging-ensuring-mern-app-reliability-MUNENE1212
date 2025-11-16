// Task Model Unit Tests
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Task = require('../../src/models/Task');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Task.deleteMany({});
});

describe('Task Model Unit Tests', () => {
  describe('Task Creation', () => {
    test('should create a valid task with all fields', async () => {
      const taskData = {
        title: 'Complete assignment',
        description: 'Finish the testing assignment',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2025-12-31'),
        tags: ['school', 'urgent'],
      };

      const task = await Task.create(taskData);

      expect(task._id).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.description).toBe(taskData.description);
      expect(task.status).toBe(taskData.status);
      expect(task.priority).toBe(taskData.priority);
      expect(task.tags).toEqual(taskData.tags);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    test('should create a task with only required fields', async () => {
      const taskData = {
        title: 'Simple task',
      };

      const task = await Task.create(taskData);

      expect(task._id).toBeDefined();
      expect(task.title).toBe(taskData.title);
      expect(task.status).toBe('todo'); // default value
      expect(task.priority).toBe('medium'); // default value
      expect(task.description).toBeUndefined();
    });

    test('should fail to create task without title', async () => {
      const taskData = {
        description: 'Task without title',
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });

    test('should fail to create task with title too short', async () => {
      const taskData = {
        title: 'AB', // less than 3 characters
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });

    test('should fail to create task with title too long', async () => {
      const taskData = {
        title: 'A'.repeat(101), // more than 100 characters
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });

    test('should fail to create task with invalid status', async () => {
      const taskData = {
        title: 'Valid title',
        status: 'invalid-status',
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });

    test('should fail to create task with invalid priority', async () => {
      const taskData = {
        title: 'Valid title',
        priority: 'invalid-priority',
      };

      await expect(Task.create(taskData)).rejects.toThrow();
    });
  });

  describe('Task Status Management', () => {
    test('should set completedAt when status changes to completed', async () => {
      const task = await Task.create({
        title: 'Test task',
        status: 'todo',
      });

      expect(task.completedAt).toBeUndefined();

      task.status = 'completed';
      await task.save();

      expect(task.completedAt).toBeDefined();
      expect(task.completedAt).toBeInstanceOf(Date);
    });

    test('should clear completedAt when status changes from completed', async () => {
      const task = await Task.create({
        title: 'Test task',
        status: 'completed',
      });

      await task.save();
      expect(task.completedAt).toBeDefined();

      task.status = 'in-progress';
      await task.save();

      expect(task.completedAt).toBeUndefined();
    });

    test('should not update completedAt if status is already completed', async () => {
      const task = await Task.create({
        title: 'Test task',
        status: 'completed',
      });

      await task.save();
      const firstCompletedAt = task.completedAt;

      // Wait a bit and save again
      await new Promise(resolve => setTimeout(resolve, 10));
      task.title = 'Updated title';
      await task.save();

      expect(task.completedAt.getTime()).toBe(firstCompletedAt.getTime());
    });
  });

  describe('Task Virtual Properties', () => {
    test('isOverdue should return false for task without due date', async () => {
      const task = await Task.create({
        title: 'Test task',
      });

      expect(task.isOverdue).toBe(false);
    });

    test('isOverdue should return false for completed task', async () => {
      const task = await Task.create({
        title: 'Test task',
        status: 'completed',
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      });

      expect(task.isOverdue).toBe(false);
    });

    test('isOverdue should return true for overdue task', async () => {
      const task = await Task.create({
        title: 'Test task',
        status: 'todo',
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      });

      expect(task.isOverdue).toBe(true);
    });

    test('isOverdue should return false for task due in future', async () => {
      const task = await Task.create({
        title: 'Test task',
        status: 'todo',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      });

      expect(task.isOverdue).toBe(false);
    });
  });

  describe('Task Update', () => {
    test('should update task fields successfully', async () => {
      const task = await Task.create({
        title: 'Original title',
        description: 'Original description',
        priority: 'low',
      });

      task.title = 'Updated title';
      task.description = 'Updated description';
      task.priority = 'high';
      await task.save();

      const updatedTask = await Task.findById(task._id);
      expect(updatedTask.title).toBe('Updated title');
      expect(updatedTask.description).toBe('Updated description');
      expect(updatedTask.priority).toBe('high');
    });

    test('should update updatedAt timestamp on save', async () => {
      const task = await Task.create({
        title: 'Test task',
      });

      const originalUpdatedAt = task.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      task.description = 'New description';
      await task.save();

      expect(task.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Task Deletion', () => {
    test('should delete task successfully', async () => {
      const task = await Task.create({
        title: 'Task to delete',
      });

      const taskId = task._id;
      await Task.findByIdAndDelete(taskId);

      const deletedTask = await Task.findById(taskId);
      expect(deletedTask).toBeNull();
    });
  });

  describe('Task Tags', () => {
    test('should store multiple tags', async () => {
      const task = await Task.create({
        title: 'Tagged task',
        tags: ['work', 'urgent', 'important'],
      });

      expect(task.tags).toHaveLength(3);
      expect(task.tags).toContain('work');
      expect(task.tags).toContain('urgent');
      expect(task.tags).toContain('important');
    });

    test('should allow empty tags array', async () => {
      const task = await Task.create({
        title: 'Task without tags',
        tags: [],
      });

      expect(task.tags).toHaveLength(0);
    });

    test('should trim tag whitespace', async () => {
      const task = await Task.create({
        title: 'Task with trimmed tags',
        tags: ['  work  ', '  urgent  '],
      });

      expect(task.tags[0]).toBe('work');
      expect(task.tags[1]).toBe('urgent');
    });
  });
});
