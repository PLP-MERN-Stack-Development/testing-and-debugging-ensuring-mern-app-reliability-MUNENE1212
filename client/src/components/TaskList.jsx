import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import './TaskList.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    fetchTasks();
  }, [filter, sortBy]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_URL}/tasks?sortBy=${sortBy}&order=desc`;
      if (filter !== 'all') {
        url += `&status=${filter}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      await fetchTasks();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      await fetchTasks();
      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      await fetchTasks();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      await fetchTasks();
    } catch (err) {
      setError(err.message);
      console.error('Error updating task status:', err);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;

    return { total, completed, inProgress, todo };
  };

  const stats = getTaskStats();

  return (
    <div className="task-list-container">
      <header className="task-header">
        <h1>Task Management</h1>
        <button onClick={handleNewTask} className="btn-new-task">
          + New Task
        </button>
      </header>

      <div className="task-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.todo}</span>
          <span className="stat-label">To Do</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCancelForm}
          initialData={editingTask}
        />
      )}

      <div className="task-controls">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
          <button onClick={fetchTasks}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create your first task to get started!</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdate={handleEditClick}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
