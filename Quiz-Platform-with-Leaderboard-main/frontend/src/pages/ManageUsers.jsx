import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import { FaTrash, FaShieldAlt, FaUser } from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/admin/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? All their quiz attempts and leaderboard data will be removed.')) {
      try {
        await API.delete(`/auth/admin/users/${id}`);
        toast.success('User deleted.');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem' }}>
          Manage <span className="gradient-text">Registered Users</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>View registered platform users, activity counts, and manage access</p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading users...</div>
        ) : (
          <div className="custom-table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Quizzes Taken</th>
                  <th>Total Points</th>
                  <th>Joined Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-hard' : 'badge-category'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.attempts_count}</td>
                    <td><span style={{ color: 'var(--primary)', fontWeight: 700 }}>{u.total_score} pts</span></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)} title="Delete User">
                          <FaTrash />
                        </button>
                      )}
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

export default ManageUsers;
