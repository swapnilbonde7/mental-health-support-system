// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

function sign(u) {
  return jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
}

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name = '', email = '', password = '' } = req.body || {};
    if (!name.trim() || !email.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ message: 'Email already registered.' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hash });

    const token = sign(user);
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    next(e);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email = '', password = '' } = req.body || {};
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = sign(user);
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    next(e);
  }
};
