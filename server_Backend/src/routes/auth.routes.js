// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

// Public routes — không cần token
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected route — cần token hợp lệ
router.get('/me', verifyToken, AuthController.getMe);

module.exports = router;