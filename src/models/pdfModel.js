import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
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

// Fix: Use the model name in mongoose.models, not schema variable
const PDF = mongoose.models.PDF || mongoose.model("PDF", pdfSchema);

export default PDF;
