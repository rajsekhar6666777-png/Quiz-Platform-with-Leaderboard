import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaShieldAlt, FaTrophy, FaStar, FaMedal, FaHistory, FaCheckCircle, FaBullseye, FaCamera, FaFire } from 'react-icons/fa';

const AVATAR_PRESETS = [
  '👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '🧠', '👑', '⚡', '🚀'
];

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '👨‍💻');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profRes, attRes] = await Promise.all([
          API.get('/auth/me'),
          API.get('/attempts/my-attempts')
        ]);
        setProfileData(profRes.data);
        setAttempts(attRes.data);
        setName(profRes.data.user.name);
        setEmail(profRes.data.user.email);
        if (profRes.data.user.avatar) {
          setSelectedAvatar(profRes.data.user.avatar);
        }
      } catch (err) {
        console.error('Fetch profile error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/profile', { name, email, avatar: selectedAvatar });
      updateUser({ name, email, avatar: selectedAvatar });
      toast.success('Profile, Email & Avatar updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Both password fields are required.');
      return;
    }
    try {
      await API.put('/auth/password', { currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading profile...</div>;
  }

  const stats = profileData?.stats || {};
  const achievements = profileData?.achievements || [];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
          User <span style={{ color: 'var(--primary)' }}>Profile & Achievements</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage profile avatar, account details, view achievements, and review attempt history</p>
      </div>

      <div className="grid-2">
        {/* Profile Card & Avatar Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-card)' }}>
            {/* Avatar Display */}
            <div style={{
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: 'var(--shadow-glow)'
            }}>
              {selectedAvatar || user?.name?.charAt(0).toUpperCase()}
            </div>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>{user?.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{user?.email}</p>

            <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <span className="badge badge-category">
                <FaShieldAlt style={{ marginRight: '4px' }} /> Role: {user?.role}
              </span>
              <span className="badge badge-medium">
                <FaTrophy style={{ marginRight: '4px' }} /> Rank: #{stats.rank_position}
              </span>
            </div>

            {/* Choose Avatar Preset */}
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <FaCamera /> Choose Avatar Icon:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {AVATAR_PRESETS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedAvatar(icon)}
                    style={{
                      fontSize: '1.4rem',
                      padding: '0.35rem 0.55rem',
                      borderRadius: '8px',
                      border: selectedAvatar === icon ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                      background: selectedAvatar === icon ? 'rgba(37, 99, 235, 0.15)' : 'var(--bg-dark-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Edit Account Details</h4>
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Save Profile & Avatar
              </button>
            </form>
          </div>
        </div>

        {/* Lifetime Stats & Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Stats Summary */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Lifetime Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-dark-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quizzes Taken</p>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>{stats.total_attempts}</h3>
              </div>
              <div style={{ background: 'var(--bg-dark-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Points</p>
                <h3 style={{ fontSize: '1.4rem', color: '#8B5CF6' }}>{stats.total_score}</h3>
              </div>
              <div style={{ background: 'var(--bg-dark-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Highest Score</p>
                <h3 style={{ fontSize: '1.4rem', color: '#EC4899' }}>{stats.highest_score}</h3>
              </div>
              <div style={{ background: 'var(--bg-dark-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Accuracy Rate</p>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--success)' }}>{stats.accuracy}%</h3>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Security Settings</h4>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Unlocked Badges & Achievements 🎖️</h3>
        <div className="grid-4">
          {achievements.map((ach) => (
            <div key={ach.id} style={{
              padding: '1.1rem',
              borderRadius: 'var(--radius-sm)',
              background: ach.unlocked ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-dark-secondary)',
              border: `1px solid ${ach.unlocked ? 'rgba(34, 197, 94, 0.4)' : 'var(--border-light)'}`,
              opacity: ach.unlocked ? 1 : 0.6
            }}>
              <h4 style={{ fontSize: '1rem', color: ach.unlocked ? 'var(--success)' : 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 700 }}>
                {ach.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{ach.desc}</p>
              <span className={`badge ${ach.unlocked ? 'badge-easy' : 'badge-medium'}`} style={{ marginTop: '0.75rem', fontSize: '0.65rem' }}>
                {ach.unlocked ? '✓ UNLOCKED' : 'LOCKED'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz History Log Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Personal Quiz Attempt History 📜</h3>
        {attempts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No attempts recorded yet.</p>
        ) : (
          <div className="custom-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Quiz Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Score</th>
                  <th>Correct / Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((att) => (
                  <tr key={att.id}>
                    <td style={{ fontWeight: 600 }}>{att.quiz_title}</td>
                    <td><span className="badge badge-category">{att.category}</span></td>
                    <td><span className={`badge badge-${att.difficulty.toLowerCase()}`}>{att.difficulty}</span></td>
                    <td><span style={{ color: 'var(--primary)', fontWeight: 800 }}>{att.score} pts</span></td>
                    <td>{att.correct} / {att.total_questions}</td>
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
    </div>
  );
};

export default Profile;
