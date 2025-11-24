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
    category: {
        type: String,
        default: "General",
    },

    uploadedBy: {

        type: String,
        required: true,
        
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

// Fix: Use the model name in mongoose.models, not schema variable
const PDF = mongoose.models.PDF || mongoose.model("PDF", pdfSchema);

export default PDF;
