"use client";

export default function CodeCard({ code, onLike }) {
    const {
        _id,
        title,
        description,
        uploadedBy,
        category,
        content,
        likes = 0,
        createdAt,
    } = code;

    const uploadedDate = createdAt ? new Date(createdAt).toLocaleDateString() : "";

    // Copy content to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        alert("Code copied to clipboard!");
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col border border-gray-300">
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{title}</h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>

            {/* Category & Author */}
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-300">
                    {category || "General"}
                </span>
                <span className="font-medium text-gray-700">By {uploadedBy}</span>
            </div>

            {/* Scrollable Code Preview */}
            <div className="mt-4 bg-gray-100 border border-gray-300 rounded-lg p-3 max-h-52 overflow-y-auto whitespace-pre-wrap text-sm font-mono text-gray-800">
                {content}
            </div>

            {/* Stats */}
            <div className="flex justify-between mt-4 text-sm text-gray-800">
                <div>
                    👍 Likes: <span className="font-semibold">{likes}</span>
                </div>

                <div className="text-right text-xs text-gray-500">
                    <div>Uploaded</div>
                    <div className="font-semibold text-gray-700">{uploadedDate}</div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
                
                {/* Like Button */}
                <button
                    onClick={() => onLike(_id)}
                    className="cursor-pointer flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                    👍 Like
                </button>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900 transition"
                >
                    📋 Copy
                </button>
            </div>
        </div>
    );
}
