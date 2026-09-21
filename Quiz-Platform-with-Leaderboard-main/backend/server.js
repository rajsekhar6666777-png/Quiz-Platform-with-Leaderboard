const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quiz Platform API is running smoothly.' });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ message: 'API Endpoint Not Found.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Quiz Platform Server running on http://localhost:${PORT}`);
});
