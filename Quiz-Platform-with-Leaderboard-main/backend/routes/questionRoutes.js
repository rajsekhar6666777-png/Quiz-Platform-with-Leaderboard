const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// Admin question management
router.post('/', verifyToken, verifyAdmin, questionController.addQuestion);
router.put('/:id', verifyToken, verifyAdmin, questionController.updateQuestion);
router.delete('/:id', verifyToken, verifyAdmin, questionController.deleteQuestion);

module.exports = router;
