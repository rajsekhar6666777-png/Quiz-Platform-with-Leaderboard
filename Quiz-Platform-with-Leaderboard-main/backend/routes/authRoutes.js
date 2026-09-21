const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/password', verifyToken, authController.changePassword);

// Admin routes
router.get('/admin/users', verifyToken, verifyAdmin, authController.getAllUsers);
router.delete('/admin/users/:id', verifyToken, verifyAdmin, authController.deleteUser);

module.exports = router;
