const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  listTasks, getTask, createTask, updateTask, deleteTask,
} = require('../controllers/taskController');

router.use(protect);

router.route('/')
  .get(listTasks)
  .post(createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
