import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { createTask } from '../services/taskService';
import Navbar from '../components/Navbar';

const AddTask = () => {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  
  // Validation and loading states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validations
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    if (description.trim().length < 20) {
      setError('Task description must be at least 20 characters long.');
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        status,
      });

      setSuccess('Task created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create task. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <div style={{ maxWidth: '600px', margin: '0 auto' }} className="animate-fade-in-up">
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginBottom: '1rem' }}
            >
              &larr; Back to Dashboard
            </button>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '2.2rem' }}>
              Create New Task
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Add details to create a new project task</p>
          </div>

          {/* Form wrapper */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            {error && (
              <div className="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div
                className="error-message"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--success)',
                  borderColor: 'rgba(16, 185, 129, 0.2)',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <div className="form-group">
                <label htmlFor="title">Task Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  placeholder="e.g. Design Dashboard UI"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading || !!success}
                  required
                />
              </div>

              {/* Description Field */}
              <div className="form-group">
                <label htmlFor="description">
                  Description <span style={{ textTransform: 'none', color: 'var(--text-muted)' }}>(Min 20 characters)</span>
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  rows="6"
                  placeholder="Provide a detailed description of the task (at least 20 characters)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading || !!success}
                  required
                  style={{ resize: 'vertical' }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    fontSize: '0.75rem',
                    marginTop: '0.4rem',
                    color: description.length >= 20 ? 'var(--success)' : 'var(--text-muted)',
                  }}
                >
                  Character count: {description.length} / 20
                </div>
              </div>

              {/* Status Field */}
              <div className="form-group">
                <label htmlFor="status">Initial Status</label>
                <select
                  id="status"
                  className="select-control"
                  style={{ width: '100%' }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={loading || !!success}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                </select>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={loading || !!success}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={loading || !!success}
                >
                  {loading ? 'Creating Task...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddTask;
