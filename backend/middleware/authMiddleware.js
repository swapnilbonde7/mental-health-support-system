// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { id: decoded.id };
      return next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token invalid/expired');
    }
  }

  res.status(401);
  throw new Error('Not authorized, no token');
});

module.exports = { protect };
