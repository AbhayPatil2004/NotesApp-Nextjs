import mongoose from "mongoose";

const imageCommentSchema = new mongoose.Schema({
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",     // Reference to Image model
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
    ref: "ImageComment", // Optional: reference to another image comment
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
const ImageComment = mongoose.models.ImageComment || mongoose.model("ImageComment", imageCommentSchema);

export default ImageComment;
