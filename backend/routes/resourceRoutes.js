const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  listResources, getResourceById, createResource, updateResource, deleteResource
} = require('../controllers/resourceController');

const router = express.Router();

// public reads
router.get('/', listResources);
router.get('/:id', getResourceById);

// auth writes
router.post('/', protect, createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;
