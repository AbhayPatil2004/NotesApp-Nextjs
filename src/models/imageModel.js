import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  cloudinaryUrl: {   // Use camelCase for consistency
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  downloads: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Use model name in mongoose.models, not schema variable
const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;
