// components/ImageCard.jsx
"use client";

import Image from "next/image";

export default function ImageCard({ image, onLike }) {
    // image is plain object from mongoose .lean()
    const {
        _id,
        title,
        description,
        uploadedBy,
        category,
        cloudinaryUrl,
        likes = 0,
        downloads = 0,
        createdAt,
    } = image;

    const uploadedDate = createdAt ? new Date(createdAt).toLocaleDateString() : "";

    return (
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg p-4 flex flex-col border border-white/10">
            {/* Image */}
            <div className="w-full h-56 relative rounded-xl overflow-hidden shadow-sm">
                <Image
                    src={cloudinaryUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                />
            </div>

            {/* Content */}
            <div className="mt-4 flex-1 text-gray-900">
                <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

                {/* Meta info */}
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-md">{category || "General"}</span>
                    <span className="font-medium text-gray-700">By {uploadedBy}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700 space-y-1">
                        <div>👍 Likes: <span className="font-semibold">{likes}</span></div>
                        {/* <div>⬇ Downloads: <span className="font-semibold">{downloads}</span></div> */}
                    </div>

                    <div className="text-right text-xs text-gray-500">
                        <div>Uploaded</div>
                        <div className="font-semibold text-gray-700">{uploadedDate}</div>
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-3">
                <button
                    onClick={() => onLike(_id)}
                    className="cursor-pointer flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                    👍 Like
                </button>

                <a
                    href={cloudinaryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer  bg-gray-800 px-4 py-2 rounded-lg  text-white font-medium hover:bg-gray-900 transition"
                >
                    ⬇ Download
                </a>
            </div>
        </div>
    );
}
