const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const rc = require('../controllers/resourceController');

router.use(protect);
router.get('/', rc.listResources);
router.post('/', rc.createResource);
router.get('/:id', rc.getResource);
router.put('/:id', rc.updateResource);
router.delete('/:id', rc.deleteResource);

module.exports = router;
