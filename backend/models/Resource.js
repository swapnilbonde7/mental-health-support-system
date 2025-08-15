const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true }, // e.g. article, video, hotline
    url:  { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional: who created it
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', ResourceSchema);
