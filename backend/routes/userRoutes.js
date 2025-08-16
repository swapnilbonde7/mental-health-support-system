// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const user = require('../controllers/userController');
const auth = require('../controllers/authController');

// session check
router.get('/me', protect, user.getMe);

// optional alias so /api/users/register also works if the UI hits it
router.post('/register', auth.register);

module.exports = router;
