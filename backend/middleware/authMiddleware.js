const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

exports.protect = asyncHandler(async (req, res, next) => {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (e) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
});
