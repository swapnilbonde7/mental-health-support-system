const router = require('express').Router();

const {
  createResource,
  getResources,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');

// NOTE: adjust the import if your starter uses a different name/path:
const { protect } = require('../middleware/authMiddleware'); 
// If the starter uses `../middleware/auth`, then:
// const { protect } = require('../middleware/auth');

router.get('/', getResources);                  // Public list
router.post('/', protect, createResource);      // Create (auth)
router.put('/:id', protect, updateResource);    // Update (auth)
router.delete('/:id', protect, deleteResource); // Delete (auth)

module.exports = router;
