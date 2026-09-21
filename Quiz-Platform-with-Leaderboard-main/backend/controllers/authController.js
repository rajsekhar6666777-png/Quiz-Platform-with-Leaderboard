const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email address is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")',
      [name, email, hashedPassword]
    );

    const userId = result.insertId;

    await pool.query(
      'INSERT INTO leaderboard (user_id, total_score, total_quizzes, average_score, rank_position) VALUES (?, 0, 0, 0.00, 0)',
      [userId]
    );

    const token = jwt.sign(
      { id: userId, name, email, role: 'user' },
      process.env.JWT_SECRET || 'quiz_platform_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: { id: userId, name, email, role: 'user' }
    });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'quiz_platform_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        created_at: user.created_at
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Get Current User Profile with Achievements
exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const [stats] = await pool.query(
      `SELECT 
        COUNT(a.id) as total_attempts,
        COALESCE(SUM(a.score), 0) as total_score,
        COALESCE(MAX(a.score), 0) as highest_score,
        COALESCE(AVG(a.score), 0) as average_score
       FROM quiz_attempts a WHERE a.user_id = ?`,
      [req.user.id]
    );

    const [lb] = await pool.query('SELECT rank_position FROM leaderboard WHERE user_id = ?', [req.user.id]);

    const totalAttempts = stats[0].total_attempts || 0;
    const totalScore = stats[0].total_score || 0;
    const avgScore = parseFloat(stats[0].average_score || 0);

    // Achievements calculation
    const achievements = [
      { id: 'first_quiz', title: 'First Steps 🎯', desc: 'Completed your first quiz challenge', unlocked: totalAttempts >= 1 },
      { id: 'quiz_master', title: 'Quiz Scholar 📚', desc: 'Completed 2 or more quizzes', unlocked: totalAttempts >= 2 },
      { id: 'high_scorer', title: 'High Flier ⚡', desc: 'Scored 5+ cumulative points', unlocked: totalScore >= 5 },
      { id: 'top_rank', title: 'Leaderboard Hero 👑', desc: 'Reached Top 3 on Global Leaderboard', unlocked: lb[0]?.rank_position > 0 && lb[0]?.rank_position <= 3 }
    ];

    res.json({
      user: users[0],
      stats: {
        total_attempts: totalAttempts,
        total_score: totalScore,
        highest_score: stats[0].highest_score,
        average_score: avgScore.toFixed(1),
        accuracy: totalAttempts > 0 ? Math.min(100, Math.round((avgScore / 5) * 100)) : 0,
        rank_position: lb[0]?.rank_position || '-'
      },
      achievements
    });
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

// Update Profile (Name, Email & Avatar)
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Check email availability if changed
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email address is already used by another account.' });
    }

    await pool.query('UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?', [name, email, avatar || '', req.user.id]);
    res.json({ message: 'Profile updated successfully!', user: { id: req.user.id, name, email, avatar } });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedNew, req.user.id]);

    res.json({ message: 'Password changed successfully!' });
  } catch (err) {
    console.error('Change Password Error:', err);
    res.status(500).json({ message: 'Server error changing password.' });
  }
};

// Admin: Get all registered users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        u.id, u.name, u.email, u.role, u.created_at,
        COUNT(a.id) as attempts_count,
        COALESCE(SUM(a.score), 0) as total_score
      FROM users u
      LEFT JOIN quiz_attempts a ON u.id = a.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(users);
  } catch (err) {
    console.error('Get All Users Error:', err);
    res.status(500).json({ message: 'Server error fetching user list.' });
  }
};

// Admin: Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete User Error:', err);
    res.status(500).json({ message: 'Server error deleting user.' });
  }
};
