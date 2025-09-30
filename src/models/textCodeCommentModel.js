import mongoose from "mongoose";

const textCodeCommentSchema = new mongoose.Schema({
  textCodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TextCode",   // Reference to TextCode model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",       // Reference to the user who commented
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TextCodeComment", // Optional: reference to another comment
    default: null,
  },
  likes: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true, // automatically adds createdAt and updatedAt
});

// Prevent model overwrite during hot reload in Next.js
const TextCodeComment = mongoose.models.TextCodeComment || mongoose.model("TextCodeComment", textCodeCommentSchema);

export default TextCodeComment;
s