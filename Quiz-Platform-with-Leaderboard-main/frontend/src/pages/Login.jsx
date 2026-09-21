import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaLock, FaEnvelope, FaBrain, FaExclamationTriangle } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      toast.success('Welcome back!');
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid password or email address. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'var(--gradient-primary)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.5rem',
            margin: '0 auto 1rem'
          }}>
            <FaBrain />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Sign in to access quizzes and track your leaderboard rank
          </p>
        </div>

        {errorMsg && (
          <div className="alert-error" role="alert">
            <FaExclamationTriangle style={{ flexShrink: 0, fontSize: '1.1rem' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-input ${errorMsg ? 'input-error' : ''}`}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-input ${errorMsg ? 'input-error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.2rem',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
