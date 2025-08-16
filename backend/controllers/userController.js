// backend/controllers/userController.js
exports.getMe = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const { _id, name, email } = req.user;
    res.json({ _id, name, email });
  };
  