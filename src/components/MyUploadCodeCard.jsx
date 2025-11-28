"use client";

export default function CodeCard({ code, onDelete }) {
    const {
        _id,
        title,
        description,
    } = code;

    return (
        <div className="bg-gray-900 text-white border border-gray-700 rounded-xl p-4 flex flex-col gap-3">

            {/* Title */}
            <h3 className="text-lg font-semibold">{title}</h3>

            {/* Description */}
            <p className="text-sm text-gray-300 line-clamp-2">{description}</p>

            {/* Buttons */}
            <div className="flex justify-end mt-2">
                <button
                    onClick={() => onDelete(_id)}
                    className="px-3 py-1 bg-red-600 text-sm rounded hover:bg-red-700 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
