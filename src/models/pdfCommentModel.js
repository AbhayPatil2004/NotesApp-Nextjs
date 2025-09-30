import mongoose from "mongoose";

const pdfCommentSchema = new mongoose.Schema({
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PDF",       // Reference to PDF model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",      // Reference to the user who commented
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PDFComment", // Optional: reference to another PDF comment
    default: null,
  },
  likes: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true, // automatically adds createdAt and updatedAt
});

// Prevent model overwrite in Next.js hot reload
const PDFComment = mongoose.models.PDFComment || mongoose.model("PDFComment", pdfCommentSchema);

export default PDFComment;
