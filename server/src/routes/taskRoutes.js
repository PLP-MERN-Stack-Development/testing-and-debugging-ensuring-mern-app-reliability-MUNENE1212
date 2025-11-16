// Task Routes
const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { validateTask, validateTaskUpdate } = require('../middleware/validation');

// Statistics route (must be before :id routes)
router.get('/stats/overview', getTaskStats);

// CRUD routes
router.route('/')
  .get(getAllTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(validateTaskUpdate, updateTask)
  .delete(deleteTask);

module.exports = router;
