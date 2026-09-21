const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// User quiz submission and attempts history
router.post('/submit', verifyToken, attemptController.submitAttempt);
router.get('/my-attempts', verifyToken, attemptController.getUserAttempts);
router.get('/stats/admin', verifyToken, verifyAdmin, attemptController.getAdminStats);
router.get('/:id', verifyToken, attemptController.getAttemptById);

module.exports = router;
