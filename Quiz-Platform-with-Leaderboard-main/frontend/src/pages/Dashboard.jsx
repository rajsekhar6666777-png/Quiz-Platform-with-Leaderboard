import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import StatCard from '../components/StatCard';
import QuizCard from '../components/QuizCard';
import { FaTrophy, FaStar, FaBrain, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profRes, attRes, quizRes] = await Promise.all([
          API.get('/auth/me'),
          API.get('/attempts/my-attempts'),
          API.get('/quizzes')
        ]);

        setProfileData(profRes.data);
        setAttempts(attRes.data);
        setAvailableQuizzes(quizRes.data.slice(0, 3));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading your dashboard...</div>;
  }

  const stats = profileData?.stats || {};

  return (
    <div>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'var(--gradient-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '1.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)' }}>
              Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name}</span>! 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Track your performance stats, attempt new quizzes, and climb the leaderboard.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <StatCard
          title="Total Quizzes"
          value={stats.total_attempts || 0}
          icon={FaBrain}
          color="var(--primary)"
          subtitle="Attempts logged"
        />
        <StatCard
          title="Total Points"
          value={stats.total_score || 0}
          icon={FaStar}
          color="#8B5CF6"
          subtitle="Cumulative score"
        />
        <StatCard
          title="Average Score"
          value={stats.average_score || '0.0'}
          icon={FaChartLine}
          color="var(--danger)"
          subtitle="Per attempt"
        />
        <StatCard
          title="Current Rank"
          value={stats.rank_position !== '-' ? `#${stats.rank_position}` : 'N/A'}
          icon={FaTrophy}
          color="var(--accent)"
          subtitle="Global leaderboard"
        />
      </div>

      {/* Recent Attempts & Available Quizzes Grid */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Recent Attempts */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Recent Quiz Attempts</h3>
          </div>

          {attempts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '1rem' }}>You haven't taken any quizzes yet!</p>
              <Link to="/quizzes" className="btn btn-primary btn-sm">Take Your First Quiz</Link>
            </div>
          ) : (
            <div className="custom-table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Correct</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice(0, 5).map((att) => (
                    <tr key={att.id}>
                      <td style={{ fontWeight: 600 }}>{att.quiz_title}</td>
                      <td>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                          {att.score} / {att.total_questions}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                          {att.correct} ({att.total_questions > 0 ? Math.round((att.correct / att.total_questions) * 100) : 0}%)
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(att.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recommended Quizzes Showcase */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Recommended Quizzes</h3>
            <Link to="/quizzes" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>View All</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {availableQuizzes.map((quiz) => (
              <div key={quiz.id} className="glass-panel" style={{ padding: '1.15rem 1.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span className="badge badge-category">{quiz.category}</span>
                    <span className="badge badge-medium">{quiz.difficulty}</span>
                  </div>
                  <h4 style={{ fontSize: '1.02rem', color: 'var(--text-main)', fontWeight: 700 }}>{quiz.title}</h4>
                </div>
                <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm">
                  Play
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
