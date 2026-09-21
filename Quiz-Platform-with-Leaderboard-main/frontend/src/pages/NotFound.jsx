import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
        <FaExclamationTriangle style={{ fontSize: '4rem', color: 'var(--warning)', marginBottom: '1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
