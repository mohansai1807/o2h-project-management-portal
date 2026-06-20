import React, { useState } from 'react';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'badge-completed';
      case 'In Progress':
        return 'badge-progress';
      case 'Pending':
      default:
        return 'badge-pending';
    }
  };

  const handleStatusSelect = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);
    try {
      await onStatusChange(task._id, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickComplete = async () => {
    setLoading(true);
    try {
      await onStatusChange(task._id, 'Completed');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await onDelete(task._id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="task-card glass-panel animate-fade-in-up" style={{ opacity: loading ? 0.7 : 1 }}>
      <div>
        <div className="task-card-header">
          <h4 className="task-title">{task.title}</h4>
          <span className={`task-status-badge ${getStatusClass(task.status)}`}>
            {task.status}
          </span>
        </div>
        <p className="task-description">{task.description}</p>
      </div>

      <div className="task-card-footer">
        <span className="task-date">
          Created: {new Date(task.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
        <div className="task-actions">
          {task.status !== 'Completed' && (
            <button
              onClick={handleQuickComplete}
              className="btn btn-secondary"
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                borderColor: 'var(--success)',
                color: 'var(--success)',
                background: 'rgba(16, 185, 129, 0.05)',
              }}
              title="Quick Complete Task"
              disabled={loading}
            >
              Complete
            </button>
          )}

          <select
            value={task.status}
            onChange={handleStatusSelect}
            className="select-control"
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              minWidth: '95px',
              borderRadius: 'var(--radius-sm)',
            }}
            disabled={loading}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            onClick={handleDeleteClick}
            className="btn btn-danger"
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
            }}
            title="Delete Task"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
