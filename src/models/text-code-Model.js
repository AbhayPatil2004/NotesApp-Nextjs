import mongoose from "mongoose";

const textCodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
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

// Use existing model if it exists (Next.js hot reload fix)
const TextCode = mongoose.models.TextCode || mongoose.model("TextCode", textCodeSchema);

export default TextCode;
