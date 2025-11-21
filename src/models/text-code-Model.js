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
    uploadedBy: {
        type : String ,
        required: true,
    },
    category: {
        type: String,
        default: "General",
    },

    content: {
        type: String,
        required: true,
    },
    comments: {
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


const TextCode = mongoose.models.TextCode || mongoose.model("TextCode", textCodeSchema);

export default TextCode;
