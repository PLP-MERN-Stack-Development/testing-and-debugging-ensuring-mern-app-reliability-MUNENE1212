import React from 'react';
import PropTypes from 'prop-types';
import './TaskItem.css';

const TaskItem = ({ task, onUpdate, onDelete, onToggleStatus }) => {
  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    onToggleStatus(task._id, newStatus);
  };

  return (
    <div className={`task-item ${getStatusClass(task.status)} ${isOverdue() ? 'overdue' : ''}`}>
      <div className="task-header">
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={handleStatusToggle}
          className="task-checkbox"
        />
        <h3 className={task.status === 'completed' ? 'completed' : ''}>{task.title}</h3>
        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className="task-status">Status: {task.status}</span>
        <span className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
          Due: {formatDate(task.dueDate)}
        </span>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="task-actions">
        <button onClick={() => onUpdate(task)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.oneOf(['todo', 'in-progress', 'completed']).isRequired,
    priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
    dueDate: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
};

export default TaskItem;
