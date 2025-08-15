// backend/routes/resourceRoutes.js
const express = require('express');
const router = express.Router();

const {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');

const { protect } = require('../middleware/authMiddleware');

// Public list (leave open for now so the UI works without login)
router.get('/', getResources);

// Create / Update / Delete (protect behind auth)
router.post('/', protect, createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;
