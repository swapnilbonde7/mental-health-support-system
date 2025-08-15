const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, password');
  }
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: sign(user._id) });
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  res.json({ _id: user._id, name: user.name, email: user.email, token: sign(user._id) });
});
