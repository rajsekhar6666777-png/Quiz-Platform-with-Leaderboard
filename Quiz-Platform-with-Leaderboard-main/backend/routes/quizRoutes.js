const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// Public routes
router.get('/', quizController.getAllQuizzes);
router.get('/categories', quizController.getCategories);
router.get('/:id', quizController.getQuizById);

// Admin routes
router.get('/:id/admin', verifyToken, verifyAdmin, quizController.getQuizAdminDetails);
router.post('/', verifyToken, verifyAdmin, quizController.createQuiz);
router.put('/:id', verifyToken, verifyAdmin, quizController.updateQuiz);
router.delete('/:id', verifyToken, verifyAdmin, quizController.deleteQuiz);

module.exports = router;
