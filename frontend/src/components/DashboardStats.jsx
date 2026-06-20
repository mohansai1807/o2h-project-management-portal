import React from 'react';

const DashboardStats = ({ stats = {} }) => {
  const { total = 0, pending = 0, progress = 0, completed = 0 } = stats;

  return (
    <div className="stats-grid animate-fade-in-up">
      {/* Total Card */}
      <div className="stat-card glass-panel">
        <div className="stat-info">
          <h3>Total Tasks</h3>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-icon stat-total">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>
        </div>
      </div>

      {/* Pending Card */}
      <div className="stat-card glass-panel">
        <div className="stat-info">
          <h3>Pending</h3>
          <span className="stat-value">{pending}</span>
        </div>
        <div className="stat-icon stat-pending">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
      </div>

      {/* In Progress Card */}
      <div className="stat-card glass-panel">
        <div className="stat-info">
          <h3>In Progress</h3>
          <span className="stat-value">{progress}</span>
        </div>
        <div className="stat-icon stat-progress">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
        </div>
      </div>

      {/* Completed Card */}
      <div className="stat-card glass-panel">
        <div className="stat-info">
          <h3>Completed</h3>
          <span className="stat-value">{completed}</span>
        </div>
        <div className="stat-icon stat-completed">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
