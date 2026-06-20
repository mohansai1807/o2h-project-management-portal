import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { getTasks, updateTask, deleteTask } from '../services/taskService';
import Navbar from '../components/Navbar';
import DashboardStats from '../components/DashboardStats';
import TaskFilter from '../components/TaskFilter';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const navigate = useNavigate();

  // State definitions
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering, search, sorting and pagination states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('createdAt:desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Authentication protection
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Load tasks function
  const loadTasks = useCallback(async (searchQuery = search) => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery.trim() !== '' ? searchQuery : undefined,
        status: status !== 'All' ? status : undefined,
        sort,
        page: currentPage,
        limit: 6, // Show 6 cards per page
      };

      const data = await getTasks(params);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setStats(data.stats);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [status, sort, currentPage]);

  // Debounced search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Reset to page 1 on search
      setCurrentPage(1);
      loadTasks(search);
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [search, status, sort]); // Also trigger if status or sort changes

  // Fetch when page changes
  useEffect(() => {
    loadTasks();
  }, [currentPage]);

  // Handle task status toggle
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      // Reload tasks to update stats and list
      loadTasks();
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Failed to update task status.');
    }
  };

  // Handle task delete
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      // Reload tasks to update stats and list
      loadTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task.');
    }
  };

  // Callback to handle filter state resets when values are changed
  const handleStatusFilterChange = (val) => {
    setStatus(val);
    setCurrentPage(1);
  };

  const handleSortFilterChange = (val) => {
    setSort(val);
    setCurrentPage(1);
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {/* Page title and top actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
          className="animate-fade-in"
        >
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '2.2rem' }}>
              Project Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage and track your tasks</p>
          </div>
          <button onClick={() => navigate('/add-task')} className="btn btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Task
          </button>
        </div>

        {/* Dashboard Statistics widget */}
        <DashboardStats stats={stats} />

        {/* Filters Panel */}
        <TaskFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={handleStatusFilterChange}
          sort={sort}
          setSort={handleSortFilterChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Error message */}
        {error && (
          <div className="error-message" style={{ margin: '2rem 0' }}>
            <span>{error}</span>
          </div>
        )}

        {/* Task cards listing */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Fetching tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state glass-panel animate-fade-in">
            <div className="empty-state-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h3>No tasks found</h3>
            <p>
              {search || status !== 'All'
                ? 'Try broadening your search criteria or resetting filters.'
                : 'Get started by creating your first task!'}
            </p>
            {!search && status === 'All' && (
              <button onClick={() => navigate('/add-task')} className="btn btn-primary">
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
