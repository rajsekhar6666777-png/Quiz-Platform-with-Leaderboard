import React, { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { FaTrophy, FaSearch, FaCrown, FaStar, FaMedal, FaDownload, FaFire, FaBullseye } from 'react-icons/fa';

const Leaderboard = () => {
  const { user } = useContext(AuthContext);
  const [rankings, setRankings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await API.get('/leaderboard', {
          params: { search: searchTerm }
        });
        setRankings(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchLeaderboard();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const exportLeaderboardCSV = () => {
    if (rankings.length === 0) return;
    let csv = 'Rank,Name,Email,Total Score,Total Quizzes,Average Score,Accuracy %\n';
    rankings.forEach((row) => {
      csv += `${row.rank},"${row.name}","${row.email}",${row.total_score},${row.total_quizzes},${row.average_score},${row.accuracy}%\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QuizMaster_Leaderboard_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const top3 = rankings.slice(0, 3);

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
          Global <span style={{ color: 'var(--primary)' }}>Leaderboard</span> 🏆
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
          Real-time global standings calculated by cumulative points, accuracy percentages, and activity streaks.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {!searchTerm && top3.length > 0 && (
        <div style={{
          display: 'flex',
          justify: 'center',
          alignItems: 'flex-end',
          gap: '1.5rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Rank 2 - Silver */}
          {top3[1] && (
            <div className="glass-panel" style={{
              padding: '1.5rem 1.25rem',
              textAlign: 'center',
              width: '200px',
              background: 'var(--bg-card)',
              borderTop: '4px solid #64748B'
            }}>
              <div style={{ color: '#64748B', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>🥈 #2</div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#64748B',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                {top3[1].name.charAt(0).toUpperCase()}
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>{top3[1].name}</h4>
              <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>{top3[1].total_score} pts</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accuracy: {top3[1].accuracy}%</p>
            </div>
          )}

          {/* Rank 1 - Gold */}
          {top3[0] && (
            <div className="glass-panel" style={{
              padding: '1.85rem 1.5rem',
              textAlign: 'center',
              width: '220px',
              background: 'var(--bg-card)',
              borderTop: '5px solid #F59E0B',
              transform: 'scale(1.05)',
              zIndex: 2
            }}>
              <FaCrown style={{ color: '#F59E0B', fontSize: '2rem', marginBottom: '0.25rem' }} />
              <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>🥇 CHAMPION</div>
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: '50%',
                background: '#F59E0B',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                {top3[0].name.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>{top3[0].name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem' }}>{top3[0].total_score} pts</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accuracy: {top3[0].accuracy}%</p>
            </div>
          )}

          {/* Rank 3 - Bronze */}
          {top3[2] && (
            <div className="glass-panel" style={{
              padding: '1.5rem 1.25rem',
              textAlign: 'center',
              width: '200px',
              background: 'var(--bg-card)',
              borderTop: '4px solid #D97706'
            }}>
              <div style={{ color: '#D97706', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>🥉 #3</div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#D97706',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem'
              }}>
                {top3[2].name.charAt(0).toUpperCase()}
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>{top3[2].name}</h4>
              <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>{top3[2].total_score} pts</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accuracy: {top3[2].accuracy}%</p>
            </div>
          )}
        </div>
      )}

      {/* Search Bar & Export CSV */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', background: 'var(--bg-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Search players by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn btn-secondary btn-sm" onClick={exportLeaderboardCSV} title="Export Leaderboard data as CSV">
          <FaDownload /> Export Leaderboard (CSV)
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel" style={{ padding: '1.25rem', background: 'var(--bg-card)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading rankings...</div>
        ) : rankings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No players found.</div>
        ) : (
          <div className="custom-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Total Score</th>
                  <th>Quizzes Taken</th>
                  <th>Accuracy</th>
                  <th>Streak</th>
                  <th>Badges</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((player) => {
                  const isCurrentUser = user && user.id === player.user_id;

                  return (
                    <tr key={player.user_id} style={{
                      background: isCurrentUser ? 'rgba(37, 99, 235, 0.12)' : 'transparent',
                      fontWeight: isCurrentUser ? 700 : 400
                    }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800 }}>
                          {player.rank === 1 && <span style={{ color: '#F59E0B', fontSize: '1.2rem' }}>🥇</span>}
                          {player.rank === 2 && <span style={{ color: '#64748B', fontSize: '1.2rem' }}>🥈</span>}
                          {player.rank === 3 && <span style={{ color: '#D97706', fontSize: '1.2rem' }}>🥉</span>}
                          <span>#{player.rank}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span style={{ color: isCurrentUser ? 'var(--primary)' : 'var(--text-main)', fontWeight: isCurrentUser ? 800 : 600 }}>
                              {player.name} {isCurrentUser && ' (You)'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>{player.total_score} pts</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{player.total_quizzes}</td>
                      <td>
                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>{player.accuracy}%</span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#F59E0B', fontWeight: 700 }}>
                          <FaFire /> {player.streak}d
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {player.badges?.map((b, idx) => (
                            <span key={idx} className="badge badge-category" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
