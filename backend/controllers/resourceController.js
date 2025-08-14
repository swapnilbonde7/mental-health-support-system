const Resource = require('../models/Resource');

/**
 * POST /api/resources
 * Body: { title, type, url, tags[], description }
 * Auth: JWT required
 */
exports.createResource = async (req, res) => {
  try {
    const { title, type, url, tags = [], description } = req.body;
    if (!title || !type || !url) {
      return res.status(400).json({ message: 'title, type and url are required' });
    }
    const normalizedTags = Array.isArray(tags)
      ? tags.map(t => String(t).trim()).filter(Boolean)
      : String(tags || '').split(',').map(t => t.trim()).filter(Boolean);

    const doc = await Resource.create({
      title,
      type,
      url,
      tags: normalizedTags,
      description,
      createdBy: req.user?._id || null, // if auth middleware sets req.user
    });
    return res.status(201).json(doc);
  } catch (err) {
    console.error('createResource error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/resources?q=&type=&tag=
 * Public – list + filters
 */
exports.getResources = async (req, res) => {
  try {
    const { q, type, tag } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (type) filter.type = type;
    if (tag) filter.tags = { $in: [tag] };

    const items = await Resource.find(filter).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error('getResources error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * PUT /api/resources/:id
 * Auth: JWT (Edit resource)
 */

exports.updateResource = async (req, res) => {
  try {
    const { title, type, url, tags = [], description } = req.body;
    const normalizedTags = Array.isArray(tags)
      ? tags.map(t => String(t).trim()).filter(Boolean)
      : String(tags || '').split(',').map(t => t.trim()).filter(Boolean);

    const payload = { title, type, url, tags: normalizedTags, description };

    const updated = await Resource.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Resource not found' });
    return res.json(updated);
  } catch (err) {
    console.error('updateResource error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * DELETE /api/resources/:id
 * Auth: JWT (Delete resource by id)
 */

exports.deleteResource = async (req, res) => {
  try {
    const deleted = await Resource.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Resource not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('deleteResource error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
