const Resource = require("../models/Resource");

/**
 * POST /api/resources
 * Body: { title, type, url, tags, description }
 * Auth: JWT required
 */
exports.createResource = async (req, res) => {
  try {
    const { title, type, url, tags, description } = req.body;

    if (!title || !type || !url) {
      return res.status(400).json({ message: "Title, type, and URL are required" });
    }

    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(",") : []);

    const newResource = new Resource({
      title,
      type,
      url,
      tags: tagsArray,
      description: description || "",
    });

    const savedResource = await newResource.save();
    res.status(201).json(savedResource);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
