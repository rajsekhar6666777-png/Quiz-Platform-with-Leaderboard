import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StatCard from '../components/StatCard';
import { FaUsers, FaBrain, FaQuestionCircle, FaHistory, FaPlus, FaTasks, FaChartBar, FaChartPie } from 'react-icons/fa';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/attempts/stats/admin');
        setStats(res.data);
      } catch (err) {
        console.error('Fetch admin stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading Admin Portal...</div>;
  }

  const categoryLabels = stats?.categoryStats?.map((c) => c.category) || ['React', 'JavaScript', 'Node.js', 'SQL', 'Aptitude'];
  const categoryAttempts = stats?.categoryStats?.map((c) => c.attempt_count) || [2, 1, 1, 1, 0];
  const categoryAvgScores = stats?.categoryStats?.map((c) => parseFloat(c.avg_score || 0)) || [4.5, 4.0, 4.0, 4.0, 0];

  const barData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Total Attempted Quizzes',
        data: categoryAttempts,
        backgroundColor: '#2563EB',
        borderRadius: 6
      }
    ]
  };

  const doughnutData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryAvgScores.map((v) => Math.max(1, v)),
        backgroundColor: ['#2563EB', '#1E40AF', '#F59E0B', '#22C55E', '#EC4899'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--text-main)' }}>
            Admin <span style={{ color: 'var(--primary)' }}>Analytics & Control Center</span> 🛡️
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage quizzes, questions, registered users, and view platform metrics</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/quizzes" className="btn btn-primary">
            <FaTasks /> Manage Quizzes
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            <FaUsers /> Manage Users
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={FaUsers} color="var(--primary)" />
        <StatCard title="Total Quizzes" value={stats?.totalQuizzes || 0} icon={FaBrain} color="#8B5CF6" />
        <StatCard title="Questions" value={stats?.totalQuestions || 0} icon={FaQuestionCircle} color="#EC4899" />
        <StatCard title="Quiz Attempts" value={stats?.totalAttempts || 0} icon={FaHistory} color="var(--success)" />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartBar style={{ color: 'var(--primary)' }} /> Quiz Attempts per Domain
          </h3>
          <div style={{ height: '220px' }}>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartPie style={{ color: '#F59E0B' }} /> Category Score Distribution
          </h3>
          <div style={{ height: '220px', display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table & Category Distribution */}
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Recent Quiz Submissions</h3>
          {stats?.recentAttempts?.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No submissions yet.</p>
          ) : (
            <div className="custom-table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentAttempts?.map((att) => (
                    <tr key={att.id}>
                      <td style={{ fontWeight: 600 }}>{att.user_name}</td>
                      <td>{att.quiz_title}</td>
                      <td>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                          {att.score} / {att.total_questions}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(att.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Overview */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Category Activity Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats?.categoryStats?.map((cat) => (
              <div key={cat.category} style={{ background: 'var(--bg-dark-secondary)', padding: '0.9rem 1.15rem', borderRadius: '10px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="badge badge-category">{cat.category}</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontWeight: 600 }}>
                    {cat.attempt_count} attempts logged
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                    Avg: {cat.avg_score ? parseFloat(cat.avg_score).toFixed(1) : 0} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
