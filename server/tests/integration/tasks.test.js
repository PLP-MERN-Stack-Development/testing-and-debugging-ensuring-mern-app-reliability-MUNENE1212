// Task API Integration Tests
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
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

describe('Task API Integration Tests', () => {
  describe('POST /api/tasks', () => {
    test('should create a new task with valid data', async () => {
      const taskData = {
        title: 'Complete testing assignment',
        description: 'Write comprehensive tests',
        priority: 'high',
        status: 'todo',
        dueDate: '2025-12-31',
        tags: ['school', 'urgent'],
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.priority).toBe(taskData.priority);
      expect(response.body.data.status).toBe(taskData.status);
      expect(response.body.data.tags).toEqual(taskData.tags);
    });

    test('should create task with minimal required data', async () => {
      const taskData = {
        title: 'Simple task',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.status).toBe('todo'); // default
      expect(response.body.data.priority).toBe('medium'); // default
    });

    test('should reject task without title', async () => {
      const taskData = {
        description: 'Task without title',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    test('should reject task with title too short', async () => {
      const taskData = {
        title: 'AB',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    test('should reject task with invalid status', async () => {
      const taskData = {
        title: 'Valid title',
        status: 'invalid-status',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    test('should reject task with invalid priority', async () => {
      const taskData = {
        title: 'Valid title',
        priority: 'invalid-priority',
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('GET /api/tasks', () => {
    test('should return all tasks', async () => {
      // Create test tasks
      await Task.create([
        { title: 'Task 1', status: 'todo' },
        { title: 'Task 2', status: 'in-progress' },
        { title: 'Task 3', status: 'completed' },
      ]);

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });

    test('should filter tasks by status', async () => {
      await Task.create([
        { title: 'Task 1', status: 'todo' },
        { title: 'Task 2', status: 'todo' },
        { title: 'Task 3', status: 'completed' },
      ]);

      const response = await request(app)
        .get('/api/tasks?status=todo')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(task => task.status === 'todo')).toBe(true);
    });

    test('should filter tasks by priority', async () => {
      await Task.create([
        { title: 'Task 1', priority: 'high' },
        { title: 'Task 2', priority: 'high' },
        { title: 'Task 3', priority: 'low' },
      ]);

      const response = await request(app)
        .get('/api/tasks?priority=high')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(task => task.priority === 'high')).toBe(true);
    });

    test('should support pagination', async () => {
      // Create 15 tasks
      const tasks = Array.from({ length: 15 }, (_, i) => ({
        title: `Task ${i + 1}`,
      }));
      await Task.create(tasks);

      const response = await request(app)
        .get('/api/tasks?page=1&limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(5);
      expect(response.body.page).toBe(1);
      expect(response.body.pages).toBe(3);
      expect(response.body.total).toBe(15);
    });

    test('should sort tasks by createdAt descending by default', async () => {
      const task1 = await Task.create({ title: 'First task' });
      await new Promise(resolve => setTimeout(resolve, 10));
      const task2 = await Task.create({ title: 'Second task' });
      await new Promise(resolve => setTimeout(resolve, 10));
      const task3 = await Task.create({ title: 'Third task' });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.data[0]._id).toBe(task3._id.toString());
      expect(response.body.data[1]._id).toBe(task2._id.toString());
      expect(response.body.data[2]._id).toBe(task1._id.toString());
    });

    test('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/tasks/:id', () => {
    test('should return task by id', async () => {
      const task = await Task.create({
        title: 'Test task',
        description: 'Test description',
        priority: 'high',
      });

      const response = await request(app)
        .get(`/api/tasks/${task._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(task._id.toString());
      expect(response.body.data.title).toBe(task.title);
      expect(response.body.data.description).toBe(task.description);
    });

    test('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    test('should return 500 for invalid task id format', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid-id')
        .expect(500);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    test('should update task successfully', async () => {
      const task = await Task.create({
        title: 'Original title',
        description: 'Original description',
        priority: 'low',
        status: 'todo',
      });

      const updates = {
        title: 'Updated title',
        description: 'Updated description',
        priority: 'high',
        status: 'in-progress',
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.description).toBe(updates.description);
      expect(response.body.data.priority).toBe(updates.priority);
      expect(response.body.data.status).toBe(updates.status);
    });

    test('should update only specified fields', async () => {
      const task = await Task.create({
        title: 'Original title',
        description: 'Original description',
        priority: 'low',
      });

      const updates = {
        title: 'Updated title',
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send(updates)
        .expect(200);

      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.description).toBe(task.description);
      expect(response.body.data.priority).toBe(task.priority);
    });

    test('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .send({ title: 'Updated title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });

    test('should reject invalid status update', async () => {
      const task = await Task.create({ title: 'Test task' });

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });

    test('should reject invalid priority update', async () => {
      const task = await Task.create({ title: 'Test task' });

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send({ priority: 'invalid-priority' })
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    test('should delete task successfully', async () => {
      const task = await Task.create({ title: 'Task to delete' });

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    test('should return 404 for non-existent task', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('GET /api/tasks/stats/overview', () => {
    test('should return task statistics', async () => {
      await Task.create([
        { title: 'Task 1', status: 'todo', priority: 'high' },
        { title: 'Task 2', status: 'todo', priority: 'low' },
        { title: 'Task 3', status: 'in-progress', priority: 'medium' },
        { title: 'Task 4', status: 'completed', priority: 'high' },
        { title: 'Task 5', status: 'completed', priority: 'low' },
      ]);

      const response = await request(app)
        .get('/api/tasks/stats/overview')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('byStatus');
      expect(response.body.data).toHaveProperty('byPriority');
      expect(response.body.data).toHaveProperty('overdue');

      // Check status counts
      const todoStatus = response.body.data.byStatus.find(s => s._id === 'todo');
      expect(todoStatus.count).toBe(2);

      const inProgressStatus = response.body.data.byStatus.find(s => s._id === 'in-progress');
      expect(inProgressStatus.count).toBe(1);

      const completedStatus = response.body.data.byStatus.find(s => s._id === 'completed');
      expect(completedStatus.count).toBe(2);
    });

    test('should count overdue tasks correctly', async () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await Task.create([
        { title: 'Overdue 1', status: 'todo', dueDate: yesterday },
        { title: 'Overdue 2', status: 'in-progress', dueDate: yesterday },
        { title: 'Not overdue - completed', status: 'completed', dueDate: yesterday },
        { title: 'Not overdue - future', status: 'todo', dueDate: tomorrow },
      ]);

      const response = await request(app)
        .get('/api/tasks/stats/overview')
        .expect(200);

      expect(response.body.data.overdue).toBe(2);
    });

    test('should return empty stats when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks/stats/overview')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.byStatus).toEqual([]);
      expect(response.body.data.byPriority).toEqual([]);
      expect(response.body.data.overdue).toBe(0);
    });
  });
});
