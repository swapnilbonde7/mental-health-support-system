// backend/controllers/resourceController.js
const asyncHandler = require('express-async-handler');
const Resource = require('../models/Resource');

// GET /api/resources  (public for now)
const getResources = asyncHandler(async (_req, res) => {
  const items = await Resource.find().sort({ createdAt: -1 });
  res.json(items);
});

// POST /api/resources  (auth required)
const createResource = asyncHandler(async (req, res) => {
  const { title, type, url, tags = [], description = '' } = req.body;

  if (!title || !type || !url) {
    res.status(400);
    throw new Error('title, type, and url are required');
  }

  const tagsArr = Array.isArray(tags)
    ? tags
    : String(tags)
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

  const doc = await Resource.create({
    title,
    type,
    url,
    tags: tagsArr,
    description,
    user: req.user?.id || null,
  });

  res.status(201).json(doc);
});

// PUT /api/resources/:id  (auth required)
const updateResource = asyncHandler(async (req, res) => {
  const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json(updated);
});

// DELETE /api/resources/:id  (auth required)
const deleteResource = asyncHandler(async (req, res) => {
  const deleted = await Resource.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json({ message: 'Deleted', id: req.params.id });
});

module.exports = {
  getResources,
  createResource,
  updateResource,
  deleteResource,
};
