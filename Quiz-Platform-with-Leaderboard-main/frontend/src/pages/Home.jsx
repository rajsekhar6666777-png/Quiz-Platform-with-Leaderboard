import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import QuizCard from '../components/QuizCard';
import { FaBrain, FaTrophy, FaRocket, FaChartBar, FaCrown, FaLayerGroup, FaGraduationCap, FaStar, FaCheckCircle, FaBolt } from 'react-icons/fa';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, topRes] = await Promise.all([
          API.get('/quizzes'),
          API.get('/leaderboard/top')
        ]);
        setFeaturedQuizzes(quizRes.data.slice(0, 3));
        setTopPlayers(topRes.data);
      } catch (err) {
        console.error('Home data load error:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Visual Hero Section with Illustration & Badges */}
      <section className="glass-panel" style={{
        padding: '2.5rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'center',
        background: 'var(--gradient-card)'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 1rem',
            background: 'rgba(37, 99, 235, 0.1)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            borderRadius: '999px',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '1rem'
          }}>
            <FaRocket style={{ color: '#F59E0B' }} /> #1 Rated Full-Stack Quiz Engine
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, margin: '0 0 1rem', color: 'var(--text-main)' }}>
            Master Skills, Test Knowledge & Conquer the <span style={{ color: 'var(--primary)' }}>Global Leaderboard</span>
          </h1>

          <p style={{ fontSize: '1.02rem', color: 'var(--text-muted)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
            Challenge yourself with interactive timed quizzes across React, JavaScript, Node.js, SQL, and Aptitude. Earn badges, track streaks, and climb to #1!
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/quizzes" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}>
              <FaBrain /> Start Quiz Now
            </Link>
            {!user ? (
              <Link to="/register" className="btn btn-secondary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}>
                Create Account
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}>
                View Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Hero Graphic Card */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '2px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            width: '100%',
            maxWidth: '380px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: '#F59E0B',
              color: '#ffffff',
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)'
            }}>
              <FaTrophy />
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>Leaderboard Cup</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Real-time Rank Calculation</p>

            <div style={{ display: 'flex', justifyContent: 'space-around', background: 'var(--bg-dark-secondary)', padding: '0.75rem', borderRadius: '10px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Players</p>
                <h4 style={{ color: 'var(--primary)', fontWeight: 800 }}>500+</h4>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pass Rate</p>
                <h4 style={{ color: 'var(--success)', fontWeight: 800 }}>92%</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section>
        <div className="grid-3">
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(37, 99, 235, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              color: 'var(--primary)',
              margin: '0 auto 1rem'
            }}>
              <FaLayerGroup />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Multi-Domain Quizzes</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Handcrafted quizzes for React, JavaScript ES6+, Node.js REST APIs, SQL, and Aptitude.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              color: '#F59E0B',
              margin: '0 auto 1rem'
            }}>
              <FaTrophy />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Live Global Standings</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Dynamic leaderboard calculations based on points, accuracy percentages, and attempt counts.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(34, 197, 94, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              color: 'var(--success)',
              margin: '0 auto 1rem'
            }}>
              <FaChartBar />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Instant Answer Review</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Instant feedback, detailed question breakdowns, and visual performance statistics.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Quizzes */}
      {featuredQuizzes.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Featured Quizzes</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Popular domain challenges ready to play</p>
            </div>
            <Link to="/quizzes" className="btn btn-outline btn-sm">Explore All</Link>
          </div>

          <div className="grid-3">
            {featuredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>
      )}

      {/* Top Players Preview */}
      {topPlayers.length > 0 && (
        <section className="glass-panel" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.3rem', color: 'var(--text-main)' }}>
              🏆 Top <span style={{ color: 'var(--primary)' }}>Performers</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Top players leading the QuizMaster global rankings</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            {topPlayers.map((player, idx) => (
              <div key={player.user_id} className="glass-panel" style={{
                padding: '1.5rem 1.25rem',
                minWidth: '200px',
                position: 'relative',
                borderTop: `4px solid ${idx === 0 ? '#F59E0B' : idx === 1 ? '#64748B' : '#D97706'}`,
                transform: idx === 0 ? 'scale(1.03)' : 'none',
                zIndex: idx === 0 ? 2 : 1
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: idx === 0 ? '#F59E0B' : idx === 1 ? '#64748B' : '#D97706',
                  color: '#FFFFFF',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}>
                  RANK #{player.rank}
                </div>

                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0.6rem auto 0.6rem'
                }}>
                  {player.name.charAt(0).toUpperCase()}
                </div>

                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>{player.name}</h4>
                <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>
                  {player.total_score} Points
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.1rem' }}>
                  {player.total_quizzes} Quizzes Taken
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.75rem' }}>
            <Link to="/leaderboard" className="btn btn-secondary btn-sm">
              <FaTrophy style={{ color: '#F59E0B' }} /> View Full Leaderboard
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
