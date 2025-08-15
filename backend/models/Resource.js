const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, default: '' },
    type: {
      type: String,
      enum: ['link', 'doc', 'video', 'other'],
      default: 'link'
    },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
