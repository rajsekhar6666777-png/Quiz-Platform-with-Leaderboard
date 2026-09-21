const pool = require('../config/db');

/**
 * Fetch Global Leaderboard Standings
 * Returns ranked users sorted by total points, average score, and quizzes completed.
 * Calculates true accuracy %: (total correct answers / total questions asked) * 100.
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const { search } = req.query;

    // Subquery aggregates total correct answers and total questions across all attempts for each user
    let query = `
      SELECT 
        l.rank_position,
        l.total_score,
        l.total_quizzes,
        l.average_score,
        COALESCE(qa.total_correct, 0) as total_correct,
        COALESCE(qa.total_asked, 0) as total_asked,
        u.id as user_id,
        u.name,
        u.email,
        u.avatar
      FROM leaderboard l
      JOIN users u ON l.user_id = u.id
      LEFT JOIN (
        SELECT user_id, SUM(correct) as total_correct, SUM(total_questions) as total_asked
        FROM quiz_attempts
        GROUP BY user_id
      ) qa ON u.id = qa.user_id
      WHERE u.role = 'user'
    `;

    const params = [];
    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Rank primarily by total score, with average score & quiz count as tie-breakers
    query += ' ORDER BY l.total_score DESC, l.average_score DESC, l.total_quizzes DESC';

    const [rankings] = await pool.query(query, params);

    // Format results with dynamic accuracy metrics and milestone badges
    const formatted = rankings.map((item, index) => {
      const rank = index + 1;
      const totalQuizzes = item.total_quizzes || 0;
      const avgScore = parseFloat(item.average_score || 0);
      const totalCorrect = parseInt(item.total_correct || 0);
      const totalAsked = parseInt(item.total_asked || 0);

      // Real Accuracy % = (Total Correct Questions / Total Questions Attempted) * 100
      const accuracy = totalAsked > 0 ? Math.min(100, Math.round((totalCorrect / totalAsked) * 100)) : 0;

      const badges = [];
      if (rank === 1) badges.push('🥇 Grandmaster');
      else if (rank === 2) badges.push('🥈 Master');
      else if (rank === 3) badges.push('🥉 Expert');

      if (accuracy >= 85) badges.push('🎯 High Accuracy');
      if (item.total_score >= 15) badges.push('🔥 Quiz Veteran');
      if (totalQuizzes >= 3) badges.push('⚡ Active Scholar');

      return {
        ...item,
        rank,
        average_score: avgScore.toFixed(1),
        accuracy,
        streak: Math.min(7, totalQuizzes + 1),
        badges
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Get Leaderboard Error:', err);
    res.status(500).json({ message: 'Server error fetching leaderboard.' });
  }
};

// Get Top 3 Players for Landing Page Showcase
exports.getTopPlayers = async (req, res) => {
  try {
    const [top] = await pool.query(`
      SELECT 
        l.rank_position,
        l.total_score,
        l.total_quizzes,
        l.average_score,
        COALESCE(qa.total_correct, 0) as total_correct,
        COALESCE(qa.total_asked, 0) as total_asked,
        u.id as user_id,
        u.name,
        u.avatar
      FROM leaderboard l
      JOIN users u ON l.user_id = u.id
      LEFT JOIN (
        SELECT user_id, SUM(correct) as total_correct, SUM(total_questions) as total_asked
        FROM quiz_attempts
        GROUP BY user_id
      ) qa ON u.id = qa.user_id
      WHERE u.role = 'user' AND l.total_quizzes > 0
      ORDER BY l.total_score DESC, l.average_score DESC
      LIMIT 3
    `);

    res.json(top.map((item, index) => {
      const totalCorrect = parseInt(item.total_correct || 0);
      const totalAsked = parseInt(item.total_asked || 0);
      const accuracy = totalAsked > 0 ? Math.min(100, Math.round((totalCorrect / totalAsked) * 100)) : 0;

      return {
        ...item,
        rank: index + 1,
        average_score: parseFloat(item.average_score).toFixed(1),
        accuracy
      };
    }));
  } catch (err) {
    console.error('Get Top Players Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
