import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/authService';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="nav-brand">
        o2h <span>Portal</span>
      </Link>

      <div className="nav-actions">
        {user ? (
          <>
            <div style={{ display: 'flex', gap: '1.5rem', marginRight: '1.5rem' }}>
              <Link
                to="/"
                className={`nav-link ${isActive('/')}`}
                style={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/add-task"
                className={`nav-link ${isActive('/add-task')}`}
                style={{
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: location.pathname === '/add-task' ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              >
                Add Task
              </Link>
            </div>

            <div className="user-badge">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="user-name" style={{ color: 'var(--text-primary)' }}>
                {user.username}
              </span>
            </div>

            <DarkModeToggle />

            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <DarkModeToggle />
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
