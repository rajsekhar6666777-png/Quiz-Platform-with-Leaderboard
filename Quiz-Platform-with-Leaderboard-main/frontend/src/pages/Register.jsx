import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUserPlus, FaBrain, FaExclamationTriangle } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password) {
      const msg = 'All fields (Name, Email, Password) are required.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Registration successful! Welcome to QuizMaster.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check details and try again.';
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
            <FaUserPlus />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Join QuizMaster to attempt quizzes and secure your position on the leaderboard
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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-input ${errorMsg && !name ? 'input-error' : ''}`}
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-input ${errorMsg && (!email || errorMsg.includes('Email')) ? 'input-error' : ''}`}
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-input ${errorMsg && (!password || password.length < 6 || errorMsg.includes('Password')) ? 'input-error' : ''}`}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-light)',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}>
          Already registered? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
