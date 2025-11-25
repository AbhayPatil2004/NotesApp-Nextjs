// components/PdfCard.jsx
"use client";

import Image from "next/image";

export default function PdfCard({
    image = {},
    onLike,
    onDownload,
}) {
    const {
        _id,
        title,
        description,
        uploadedBy,
        category,
        cloudinaryUrl,
        fileType,
        likes = 0,
        downloads = 0,
        createdAt,
    } = image || {};

    const uploadedDate = createdAt ? new Date(createdAt).toLocaleDateString() : "";

    const urlLower =
        typeof cloudinaryUrl === "string" ? cloudinaryUrl.toLowerCase() : "";

    const isPdf =
        (fileType && fileType.toLowerCase() === "application/pdf") ||
        urlLower.endsWith(".pdf") ||
        urlLower.includes("/pdf");

    const isImage = /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(urlLower);

    function handleDownloadClick(e) {
        e.preventDefault();
        if (typeof onDownload === "function") {
            onDownload(_id, cloudinaryUrl);
        } else {
            window.open(cloudinaryUrl, "_blank", "noopener,noreferrer");
        }
    }

    return (
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg p-4 flex flex-col border border-white/10">

            {/* Preview */}
            <div className="w-full h-40 relative rounded-xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">

                {isPdf ? (
                    <div className="flex flex-col items-center text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 mb-1 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
                        </svg>
                        <p className="text-xs font-medium">PDF File</p>
                    </div>
                ) : isImage ? (
                    <Image
                        src={cloudinaryUrl}
                        alt={title || "image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                    />
                ) : (
                    <p className="text-sm text-gray-500">No preview available</p>
                )}
            </div>


            {/* Content */}
            <div className="mt-4 flex-1 text-gray-900">
                <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded-md">
                        {category || "General"}
                    </span>
                    <span className="font-medium text-gray-700">By {uploadedBy}</span>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-700 space-y-1 ">
                        <div>
                            👍 Likes: <span className="font-semibold">{likes}</span>
                        </div>
                        <div>
                            ⬇ Downloads: <span className="font-semibold">{downloads}</span>
                        </div>
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
                    onClick={() => onLike && onLike(_id)}
                    className="cursor-pointer flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                    👍 Like
                </button>

                <button
                    onClick={handleDownloadClick}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                >
                    ⬇ Open / Download
                </button>
            </div>
        </div>
    );
}
