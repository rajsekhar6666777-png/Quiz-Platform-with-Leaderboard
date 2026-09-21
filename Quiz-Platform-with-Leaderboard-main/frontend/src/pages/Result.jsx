import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaTrophy, FaCheckCircle, FaTimesCircle, FaMinusCircle, FaClock, FaRedo, FaHome } from 'react-icons/fa';

const Result = () => {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.resultData || null);
  const [loading, setLoading] = useState(!location.state?.resultData);

  useEffect(() => {
    if (!result && attemptId) {
      const fetchAttempt = async () => {
        try {
          const res = await API.get(`/attempts/${attemptId}`);
          const pct = res.data.total_questions > 0 ? (res.data.correct / res.data.total_questions) * 100 : 0;
          setResult({
            score: res.data.score,
            correct: res.data.correct,
            wrong: res.data.wrong,
            skipped: res.data.skipped,
            totalQuestions: res.data.total_questions,
            percentage: pct % 1 === 0 ? Math.round(pct) : pct.toFixed(1),
            timeTaken: res.data.time_taken,
            quizTitle: res.data.quiz_title
          });
        } catch (err) {
          console.error('Error fetching result:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchAttempt();
    }
  }, [attemptId, result]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Calculating score...</div>;
  }

  if (!result) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Result Not Found</h3>
        <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go to Dashboard</Link>
      </div>
    );
  }

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 80) return { title: '🏆 Mastermind!', desc: 'Outstanding score! You executed with extreme precision.', color: 'var(--success)' };
    if (percentage >= 60) return { title: '🌟 Great Job!', desc: 'Solid performance! You have a good grasp of concepts.', color: 'var(--primary)' };
    return { title: '💪 Keep Practicing!', desc: 'Keep learning and review weak areas for your next attempt.', color: 'var(--accent)' };
  };

  const perf = getPerformanceMessage(result.percentage);
  const displayPercentage = typeof result.percentage === 'number' && result.percentage % 1 === 0 
    ? Math.round(result.percentage) 
    : result.percentage;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Score Header Panel */}
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem', background: 'var(--gradient-card)' }}>
        <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem', fontWeight: 700 }}>
          Quiz Result: {result.quizTitle}
        </h2>

        <h1 style={{ fontSize: '2.6rem', color: perf.color, margin: '0.5rem 0' }}>
          {perf.title}
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
          {perf.desc}
        </p>

        <div style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          border: `4px solid ${perf.color}`,
          background: 'var(--bg-card)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2rem',
          padding: '1rem'
        }}>
          <span style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {displayPercentage}%
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.4rem' }}>
            Score: {result.score} pts
          </span>
        </div>

        {/* Breakdown Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--success)', fontWeight: 700 }}>
            <FaCheckCircle /> {result.correct} Correct
          </div>
          <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontWeight: 700 }}>
            <FaTimesCircle /> {result.wrong} Wrong
          </div>
          <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(148, 163, 184, 0.15)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontWeight: 700 }}>
            <FaMinusCircle /> {result.skipped} Skipped
          </div>
          <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--primary)', fontWeight: 700 }}>
            <FaClock /> {result.timeTaken}s Time
          </div>
        </div>
      </div>

      {/* Answer Breakdown List */}
      {result.answerBreakdown && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Detailed Answer Review</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {result.answerBreakdown.map((item, idx) => (
              <div key={idx} style={{
                padding: '1.35rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderLeft: `5px solid ${item.status === 'correct' ? 'var(--success)' : item.status === 'wrong' ? 'var(--danger)' : 'var(--text-dim)'}`
              }}>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.85rem', color: 'var(--text-main)' }}>
                  Q{idx + 1}. {item.question}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.6rem', fontSize: '0.92rem' }}>
                  {[1, 2, 3, 4].map((optNum) => {
                    const isUserChoice = item.selectedOption === optNum;
                    const isCorrectChoice = item.correctOption === optNum;

                    let bg = 'var(--bg-dark-secondary)';
                    let color = 'var(--text-muted)';
                    let border = '1px solid var(--border-light)';

                    if (isCorrectChoice) {
                      bg = 'rgba(34, 197, 94, 0.15)';
                      color = 'var(--success)';
                      border = '1px solid rgba(34, 197, 94, 0.4)';
                    } else if (isUserChoice && !isCorrectChoice) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      color = 'var(--danger)';
                      border = '1px solid rgba(239, 68, 68, 0.4)';
                    }

                    return (
                      <div key={optNum} style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', background: bg, color, border, fontWeight: (isCorrectChoice || isUserChoice) ? 700 : 500 }}>
                        {String.fromCharCode(64 + optNum)}. {item[`option${optNum}`]}
                        {isCorrectChoice && ' ✓'}
                        {isUserChoice && !isCorrectChoice && ' ✗'}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/quizzes" className="btn btn-secondary">
          <FaRedo /> Retake / Other Quizzes
        </Link>
        <Link to="/leaderboard" className="btn btn-primary">
          <FaTrophy style={{ color: '#F59E0B' }} /> Check Leaderboard Rank
        </Link>
        <Link to="/dashboard" className="btn btn-outline">
          <FaHome /> Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Result;
