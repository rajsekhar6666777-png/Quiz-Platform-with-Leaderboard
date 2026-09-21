const pool = require('../config/db');

// Submit Quiz Attempt & Calculate Score
exports.submitAttempt = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quiz_id, user_answers, time_taken } = req.body;

    if (!quiz_id || !user_answers) {
      return res.status(400).json({ message: 'Quiz ID and answers are required.' });
    }

    // Fetch quiz & official questions with correct options
    const [quiz] = await pool.query('SELECT * FROM quizzes WHERE id = ?', [quiz_id]);
    if (quiz.length === 0) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const [questions] = await pool.query('SELECT * FROM questions WHERE quiz_id = ?', [quiz_id]);

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let totalScore = 0;
    const answerBreakdown = [];

    questions.forEach((q) => {
      const selected = user_answers[q.id]; // 1, 2, 3, 4 or undefined
      let status = 'skipped';

      if (selected !== undefined && selected !== null && selected !== '') {
        if (parseInt(selected) === q.correct_option) {
          correctCount++;
          totalScore += q.marks;
          status = 'correct';
        } else {
          wrongCount++;
          status = 'wrong';
        }
      } else {
        skippedCount++;
      }

      answerBreakdown.push({
        questionId: q.id,
        question: q.question,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4,
        selectedOption: selected ? parseInt(selected) : null,
        correctOption: q.correct_option,
        marks: q.marks,
        status
      });
    });

    const totalQuestions = questions.length;

    // Insert Attempt record
    const [result] = await pool.query(
      `INSERT INTO quiz_attempts 
       (user_id, quiz_id, score, correct, wrong, skipped, total_questions, time_taken) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, quiz_id, totalScore, correctCount, wrongCount, skippedCount, totalQuestions, time_taken || 0]
    );

    const attemptId = result.insertId;

    // Update Leaderboard Aggregates for User
    await updateLeaderboard(userId);

    res.status(201).json({
      message: 'Quiz submitted successfully!',
      attemptId,
      result: {
        score: totalScore,
        correct: correctCount,
        wrong: wrongCount,
        skipped: skippedCount,
        totalQuestions,
        percentage: totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(1) : 0,
        timeTaken: time_taken || 0,
        quizTitle: quiz[0].title,
        answerBreakdown
      }
    });
  } catch (err) {
    console.error('Submit Attempt Error:', err);
    res.status(500).json({ message: 'Server error processing quiz submission.' });
  }
};

// Helper: Recalculate Leaderboard scores & ranks
async function updateLeaderboard(userId) {
  try {
    const [stats] = await pool.query(
      `SELECT 
        COUNT(id) as total_quizzes,
        COALESCE(SUM(score), 0) as total_score,
        COALESCE(AVG(score), 0) as average_score
       FROM quiz_attempts 
       WHERE user_id = ?`,
      [userId]
    );

    const totalQuizzes = stats[0].total_quizzes || 0;
    const totalScore = stats[0].total_score || 0;
    const avgScore = parseFloat(stats[0].average_score || 0).toFixed(2);

    // Check if user entry exists in leaderboard
    const [lbCheck] = await pool.query('SELECT id FROM leaderboard WHERE user_id = ?', [userId]);

    if (lbCheck && lbCheck.length > 0) {
      await pool.query(
        'UPDATE leaderboard SET total_score = ?, total_quizzes = ?, average_score = ? WHERE user_id = ?',
        [totalScore, totalQuizzes, avgScore, userId]
      );
    } else {
      await pool.query(
        'INSERT INTO leaderboard (user_id, total_score, total_quizzes, average_score, rank_position) VALUES (?, ?, ?, ?, 0)',
        [userId, totalScore, totalQuizzes, avgScore]
      );
    }

    // Recalculate rank positions for all users on leaderboard
    const [allEntries] = await pool.query(
      `SELECT id FROM leaderboard ORDER BY total_score DESC, average_score DESC, total_quizzes DESC`
    );

    for (let i = 0; i < allEntries.length; i++) {
      await pool.query('UPDATE leaderboard SET rank_position = ? WHERE id = ?', [i + 1, allEntries[i].id]);
    }
  } catch (err) {
    console.error('Update Leaderboard Error:', err);
  }
}

// Get Logged-in User's Attempts
exports.getUserAttempts = async (req, res) => {
  try {
    const userId = req.user.id;
    const [attempts] = await pool.query(
      `SELECT 
        a.*, q.title as quiz_title, q.category, q.difficulty
       FROM quiz_attempts a
       JOIN quizzes q ON a.quiz_id = q.id
       WHERE a.user_id = ?
       ORDER BY a.submitted_at DESC`,
      [userId]
    );
    res.json(attempts);
  } catch (err) {
    console.error('Get User Attempts Error:', err);
    res.status(500).json({ message: 'Server error fetching user attempts.' });
  }
};

// Get Single Attempt Details with Review
exports.getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const [attempts] = await pool.query(
      `SELECT a.*, q.title as quiz_title, u.name as user_name 
       FROM quiz_attempts a
       JOIN quizzes q ON a.quiz_id = q.id
       JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [id]
    );

    if (attempts.length === 0) {
      return res.status(404).json({ message: 'Attempt not found.' });
    }

    // Verify ownership or admin
    const attempt = attempts[0];
    if (attempt.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized view.' });
    }

    res.json(attempt);
  } catch (err) {
    console.error('Get Attempt By ID Error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Admin: System-wide Stats Dashboard
exports.getAdminStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users WHERE role = "user"');
    const [[{ totalQuizzes }]] = await pool.query('SELECT COUNT(*) as totalQuizzes FROM quizzes');
    const [[{ totalQuestions }]] = await pool.query('SELECT COUNT(*) as totalQuestions FROM questions');
    const [[{ totalAttempts }]] = await pool.query('SELECT COUNT(*) as totalAttempts FROM quiz_attempts');

    const [recentAttempts] = await pool.query(`
      SELECT a.id, u.name as user_name, q.title as quiz_title, a.score, a.total_questions, a.submitted_at
      FROM quiz_attempts a
      JOIN users u ON a.user_id = u.id
      JOIN quizzes q ON a.quiz_id = q.id
      ORDER BY a.submitted_at DESC
      LIMIT 5
    `);

    const [categoryStats] = await pool.query(`
      SELECT q.category, COUNT(a.id) as attempt_count, AVG(a.score) as avg_score
      FROM quizzes q
      LEFT JOIN quiz_attempts a ON q.id = a.quiz_id
      GROUP BY q.category
    `);

    res.json({
      totalUsers: totalUsers || 0,
      totalQuizzes: totalQuizzes || 0,
      totalQuestions: totalQuestions || 0,
      totalAttempts: totalAttempts || 0,
      recentAttempts: recentAttempts || [],
      categoryStats: categoryStats || []
    });
  } catch (err) {
    console.error('Get Admin Stats Error:', err);
    res.status(500).json({ message: 'Server error fetching admin statistics.' });
  }
};
