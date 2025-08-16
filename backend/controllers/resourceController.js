const Resource = require('../models/Resource');

// GET /api/resources (auth)
exports.listResources = async (req, res, next) => {
  try {
    const items = await Resource.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) { next(e); }
};

// GET /api/resources/:id (auth)
exports.getResource = async (req, res, next) => {
  try {
    const item = await Resource.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!item) return res.status(404).json({ message: 'Resource not found' });
    res.json(item);
  } catch (e) { next(e); }
};

// POST /api/resources (auth)
exports.createResource = async (req, res, next) => {
  try {
    let { title, url, type, tags, description } = req.body || {};
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });

    if (typeof tags === 'string') {
      tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const resource = await Resource.create({
      title: title.trim(),
      url: (url || '').trim(),
      type: (type || 'link').toLowerCase(),
      description: (description || '').trim(),
      tags: Array.isArray(tags) ? tags : [],
      createdBy: req.user._id,
    });

    res.status(201).json(resource);
  } catch (e) { next(e); }
};

// PUT /api/resources/:id (auth)
exports.updateResource = async (req, res, next) => {
  try {
    const item = await Resource.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!item) return res.status(404).json({ message: 'Resource not found' });

    const { title, url, type, tags, description } = req.body || {};
    if (title !== undefined) item.title = title;
    if (url !== undefined) item.url = url;
    if (type !== undefined) item.type = String(type).toLowerCase();
    if (description !== undefined) item.description = description;
    if (tags !== undefined) {
      let arr = tags;
      if (typeof arr === 'string') arr = arr.split(',').map(t => t.trim()).filter(Boolean);
      item.tags = Array.isArray(arr) ? arr : [];
    }

    res.json(await item.save());
  } catch (e) { next(e); }
};

// DELETE /api/resources/:id (auth)
exports.deleteResource = async (req, res, next) => {
  try {
    const item = await Resource.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!item) return res.status(404).json({ message: 'Resource not found' });
    await item.deleteOne();
    res.json({ ok: true });
  } catch (e) { next(e); }
};
