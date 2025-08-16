const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');

// helpers
function parseDateSafe(input) {
  if (!input) return null;
  const d = new Date(input);
  return isNaN(d) ? null : d;
}
function normalizeStatus(s, fallback = 'TODO') {
  const valid = ['TODO', 'IN_PROGRESS', 'DONE'];
  const str = String(s || fallback).trim().replace(/[\s-]+/g, '_').toUpperCase();
  return valid.includes(str) ? str : fallback;
}

// GET /api/tasks
exports.listTasks = asyncHandler(async (req, res) => {
  const items = await Task.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
});

// GET /api/tasks/:id
exports.getTask = asyncHandler(async (req, res) => {
  const item = await Task.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!item) { res.status(404); throw new Error('Task not found'); }
  res.json(item);
});

// POST /api/tasks
exports.createTask = asyncHandler(async (req, res) => {
  let { title, description, status, dueDate, tags } = req.body || {};
  if (!title || !title.trim()) { res.status(400); throw new Error('Title is required'); }

  if (typeof tags === 'string') {
    tags = tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  const created = await Task.create({
    title: title.trim(),
    description: (description || '').trim(),
    status: normalizeStatus(status, 'TODO'),
    dueDate: parseDateSafe(dueDate),
    tags: Array.isArray(tags) ? tags : [],
    createdBy: req.user.id,
  });

  res.status(201).json(created);
});

// PUT /api/tasks/:id
exports.updateTask = asyncHandler(async (req, res) => {
  const item = await Task.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!item) { res.status(404); throw new Error('Task not found'); }

  const { title, description, status, dueDate, tags } = req.body || {};

  if (title !== undefined) item.title = title;
  if (description !== undefined) item.description = description;
  if (status !== undefined) item.status = normalizeStatus(status, item.status);
  if (dueDate !== undefined) item.dueDate = parseDateSafe(dueDate);

  if (tags !== undefined) {
    let arr = tags;
    if (typeof arr === 'string') {
      arr = arr.split(',').map(t => t.trim()).filter(Boolean);
    }
    item.tags = Array.isArray(arr) ? arr : [];
  }

  res.json(await item.save());
});

// DELETE /api/tasks/:id
exports.deleteTask = asyncHandler(async (req, res) => {
  const item = await Task.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!item) { res.status(404); throw new Error('Task not found'); }
  await item.deleteOne();
  res.json({ ok: true });
});
