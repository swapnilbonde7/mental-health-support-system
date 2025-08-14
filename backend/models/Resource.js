const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["article", "video", "guide"], required: true },
    url: { type: String, required: true },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", ResourceSchema);
