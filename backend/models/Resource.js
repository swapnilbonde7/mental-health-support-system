const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, default: '' }, // optional (for "doc"/"other")
    type: {
      type: String,
      enum: ['link', 'doc', 'video', 'other'],
      default: 'link',
    },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', ResourceSchema);
