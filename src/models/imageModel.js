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
    uploadedBy: {

        type: String,
        required: true,
    },
    category: {
        type: String,
        default: "General",
    },

    cloudinaryUrl: {
        type: String,
        required: true,
    },
    
    comments: [
        {
            comment: { type: String, required: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
            createdAt: { type: Date, default: Date.now }
        }
    ],

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

const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;
