const pool = require('../config/db');

// Add question to quiz
exports.addQuestion = async (req, res) => {
  try {
    const { quiz_id, question, option1, option2, option3, option4, correct_option, marks } = req.body;

    if (!quiz_id || !question || !option1 || !option2 || !option3 || !option4 || !correct_option) {
      return res.status(400).json({ message: 'All question fields and correct_option (1-4) are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO questions (quiz_id, question, option1, option2, option3, option4, correct_option, marks) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [quiz_id, question, option1, option2, option3, option4, parseInt(correct_option), marks || 1]
    );

    res.status(201).json({
      message: 'Question added successfully!',
      questionId: result.insertId
    });
  } catch (err) {
    console.error('Add Question Error:', err);
    res.status(500).json({ message: 'Server error adding question.' });
  }
};

// Update question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, option1, option2, option3, option4, correct_option, marks } = req.body;

    await pool.query(
      `UPDATE questions 
       SET question = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, correct_option = ?, marks = ? 
       WHERE id = ?`,
      [question, option1, option2, option3, option4, parseInt(correct_option), marks || 1, id]
    );

    res.json({ message: 'Question updated successfully!' });
  } catch (err) {
    console.error('Update Question Error:', err);
    res.status(500).json({ message: 'Server error updating question.' });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM questions WHERE id = ?', [id]);
    res.json({ message: 'Question deleted successfully.' });
  } catch (err) {
    console.error('Delete Question Error:', err);
    res.status(500).json({ message: 'Server error deleting question.' });
  }
};
