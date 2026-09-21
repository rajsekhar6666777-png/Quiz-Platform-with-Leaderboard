import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaGithub, FaLinkedin, FaShieldAlt, FaFileAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-light)',
      padding: '2.5rem 1.5rem 1.5rem',
      marginTop: 'auto',
      transition: 'background 0.3s ease, border-color 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              background: 'var(--primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '1.1rem'
            }}>
              <FaBrain />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)' }}>
              Quiz<span style={{ color: 'var(--primary)' }}>Master</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.5' }}>
            The ultimate full-stack learning platform to challenge your tech skills, earn points, and climb the global leaderboard.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.85rem' }}>Quick Navigation</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li><Link to="/quizzes">All Quizzes</Link></li>
            <li><Link to="/leaderboard">Global Leaderboard</Link></li>
            <li><Link to="/dashboard">User Dashboard</Link></li>
            <li><Link to="/login">Account Login</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.85rem' }}>Popular Domains</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            <li>React.js Fundamentals</li>
            <li>JavaScript ES6+ Mastery</li>
            <li>Node.js & Express REST APIs</li>
            <li>SQL Relational Databases</li>
          </ul>
        </div>

        {/* Connect & Legal */}
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '0.85rem' }}>Connect & Links</h4>
          <div style={{ display: 'flex', gap: '0.85rem', fontSize: '1.3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub"><FaGithub /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn"><FaLinkedin /></a>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Full-Stack Web Development Internship Project
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        flexWrap: 'wrap',
        justify: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <span>&copy; {new Date().getFullYear()} QuizMaster Platform. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
