const asyncHandler = require('express-async-handler');
const Resource = require('../models/Resource');

// GET /api/resources  (public)
exports.listResources = asyncHandler(async (_req, res) => {
  const items = await Resource.find({}).sort({ createdAt: -1 });
  res.json(items);
});

// GET /api/resources/:id  (public)
exports.getResourceById = asyncHandler(async (req, res) => {
  const r = await Resource.findById(req.params.id);
  if (!r) { res.status(404); throw new Error('Resource not found'); }
  res.json(r);
});

// POST /api/resources  (protected)
exports.createResource = asyncHandler(async (req, res) => {
  const { title, url, type, description, tags } = req.body || {};
  const r = await Resource.create({
    title,
    url: url || '',
    type: (type || 'link').toLowerCase(),
    description: description || '',
    tags: Array.isArray(tags) ? tags : String(tags || '').split(',').map(t => t.trim()).filter(Boolean)
  });
  res.status(201).json(r);
});

// PUT /api/resources/:id  (protected)
exports.updateResource = asyncHandler(async (req, res) => {
  const r = await Resource.findById(req.params.id);
  if (!r) { res.status(404); throw new Error('Resource not found'); }
  const { title, url, type, description, tags } = req.body || {};
  if (title !== undefined) r.title = title;
  if (url !== undefined) r.url = url;
  if (type !== undefined) r.type = String(type).toLowerCase();
  if (description !== undefined) r.description = description;
  if (tags !== undefined) r.tags = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
  res.json(await r.save());
});

// DELETE /api/resources/:id  (protected)
exports.deleteResource = asyncHandler(async (req, res) => {
  const r = await Resource.findById(req.params.id);
  if (!r) { res.status(404); throw new Error('Resource not found'); }
  await r.deleteOne();
  res.json({ ok: true });
});
