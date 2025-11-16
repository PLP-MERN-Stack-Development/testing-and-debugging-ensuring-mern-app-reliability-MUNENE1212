// Task Controller
const Task = require('../models/Task');
const logger = require('../utils/logger');

/**
 * Get all tasks with optional filtering and pagination
 * @route GET /api/tasks
 */
exports.getAllTasks = async (req, res) => {
  const { status, priority, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;
  const sortOrder = order === 'asc' ? 1 : -1;

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Task.countDocuments(filter);

  logger.info(`Retrieved ${tasks.length} tasks`);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: tasks,
  });
};

/**
 * Get a single task by ID
 * @route GET /api/tasks/:id
 */
exports.getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');

  if (!task) {
    logger.warn(`Task not found: ${req.params.id}`);
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  logger.info(`Retrieved task: ${task._id}`);

  res.status(200).json({
    success: true,
    data: task,
  });
};

/**
 * Create a new task
 * @route POST /api/tasks
 */
exports.createTask = async (req, res) => {
  const taskData = {
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || 'todo',
    priority: req.body.priority || 'medium',
    dueDate: req.body.dueDate,
    assignedTo: req.body.assignedTo,
    tags: req.body.tags,
  };

  const task = await Task.create(taskData);

  logger.info(`Task created: ${task._id}`);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
};

/**
 * Update a task
 * @route PUT /api/tasks/:id
 */
exports.updateTask = async (req, res) => {
  const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'assignedTo', 'tags'];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  ).populate('assignedTo', 'name email');

  if (!task) {
    logger.warn(`Task not found for update: ${req.params.id}`);
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  logger.info(`Task updated: ${task._id}`);

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
};

/**
 * Delete a task
 * @route DELETE /api/tasks/:id
 */
exports.deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    logger.warn(`Task not found for deletion: ${req.params.id}`);
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });
  }

  logger.info(`Task deleted: ${req.params.id}`);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {},
  });
};

/**
 * Get task statistics
 * @route GET /api/tasks/stats/overview
 */
exports.getTaskStats = async (req, res) => {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityStats = await Task.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
      },
    },
  ]);

  const overdueTasks = await Task.countDocuments({
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' },
  });

  logger.info('Task statistics retrieved');

  res.status(200).json({
    success: true,
    data: {
      byStatus: stats,
      byPriority: priorityStats,
      overdue: overdueTasks,
    },
  });
};
