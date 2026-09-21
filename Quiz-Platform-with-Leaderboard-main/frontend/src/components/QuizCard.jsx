import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaPlay, FaStar, FaUsers, FaMedal } from 'react-icons/fa';

const QuizCard = ({ quiz }) => {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'badge-easy';
      case 'Medium': return 'badge-medium';
      case 'Hard': return 'badge-hard';
      default: return 'badge-medium';
    }
  };

  const minutes = Math.floor(quiz.time_limit / 60);

  return (
    <div className="glass-panel" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      position: 'relative',
      background: 'var(--bg-card)',
      borderTop: '4px solid var(--primary)'
    }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <span className="badge badge-category">{quiz.category}</span>
          <span className={`badge ${getDifficultyBadge(quiz.difficulty)}`}>{quiz.difficulty}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#F59E0B', fontSize: '0.88rem', fontWeight: 700 }}>
          <FaStar /> {quiz.rating || '4.8'} / 5.0
        </div>

        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 700 }}>
          {quiz.title}
        </h3>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          lineHeight: '1.5',
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {quiz.description}
        </p>
      </div>

      <div>
        {/* Rich Metadata Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--border-light)',
          marginBottom: '1.15rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          fontWeight: 600
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FaQuestionCircle style={{ color: 'var(--primary)' }} /> {quiz.question_count || 5} Qs
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FaClock style={{ color: 'var(--secondary)' }} /> {minutes} Mins
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FaUsers style={{ color: 'var(--success)' }} /> {quiz.attempts_count || 12} Played
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FaMedal style={{ color: '#F59E0B' }} /> Best: {quiz.high_score || 5} pts
          </span>
        </div>

        <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
          <FaPlay style={{ fontSize: '0.75rem' }} /> Take Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
