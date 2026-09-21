import React, { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';

const Timer = ({ initialSeconds, onTimeUp }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isWarning = secondsLeft < 60;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: isWarning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
      border: `1px solid ${isWarning ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.3)'}`,
      borderRadius: 'var(--radius-full)',
      color: isWarning ? '#f87171' : 'var(--text-main)',
      fontWeight: 700,
      fontSize: '0.95rem'
    }}>
      <FaClock style={{ color: isWarning ? '#ef4444' : 'var(--primary)' }} />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
