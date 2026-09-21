import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', subtitle }) => {
  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.25rem'
    }}>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '14px',
        background: `${color}20`,
        border: `1px solid ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: color,
        flexShrink: 0
      }}>
        <Icon />
      </div>

      <div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </p>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.1rem 0' }}>
          {value}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
