import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaBrain, FaTrophy, FaUser, FaSignOutAlt, FaBars, FaTimes, FaShieldAlt, FaChartLine, FaSun, FaMoon } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <FaBrain />
          </div>
          <span>Quiz<span style={{ color: 'var(--primary)' }}>Master</span></span>
        </Link>

        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/quizzes" className={`nav-link ${isActive('/quizzes') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Quizzes
          </Link>
          <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <FaTrophy style={{ color: '#F59E0B', marginRight: '4px' }} /> Leaderboard
          </Link>

          {user && (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className={`nav-link admin-badge ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <FaShieldAlt /> Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <FaChartLine /> Dashboard
                </Link>
              )}
            </>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-dark-secondary)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-main)',
              padding: '0.45rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
            title="Toggle Dark / Light Mode"
          >
            {theme === 'light' ? <FaMoon style={{ color: '#6366F1' }} /> : <FaSun style={{ color: '#F59E0B' }} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <div className="nav-auth-buttons">
            {user ? (
              <div className="user-profile-menu">
                <Link to="/profile" className="user-pill" onClick={() => setMobileMenuOpen(false)}>
                  <div className="avatar-circle">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user.name}</span>
                </Link>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout} title="Logout">
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
