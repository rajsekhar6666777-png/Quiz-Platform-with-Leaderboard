import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div style={{ width: '100%', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
        <span>Question {current} of {total}</span>
        <span>{Math.round(percentage)}% Completed</span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '999px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: 'var(--gradient-primary)',
          transition: 'width 0.3s ease',
          borderRadius: '999px'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
