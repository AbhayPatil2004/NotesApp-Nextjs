// components/ImagesPage.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ImageCard from "@/components/ImageCard";

export default function ImagesPage() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // search state
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let mounted = true;
        async function fetchImages() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/api/fetchData/fetchImages");
                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err?.message || `HTTP ${res.status}`);
                }

                const payload = await res.json();
                const dataArray = payload?.images ?? payload?.fetchedData ?? payload?.data ?? [];

                if (mounted) {
                    const arr = Array.isArray(dataArray) ? dataArray : [];
                    setImages([...arr].reverse()); // reverse the sequence
                }

            } catch (err) {
                if (mounted) setError(err.message || "Failed to load images");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchImages();
        return () => {
            mounted = false;
        };
    }, []);

    // Keep hooks order stable: useMemo must be called on every render (before early returns)
    const filteredImages = useMemo(() => {
        const q = (searchTerm || "").trim().toLowerCase();
        if (!q) return images;

        return images.filter((img) => {
            const title = String(img.title ?? "").toLowerCase();
            const uploadedBy = String(img.uploadedBy ?? img.user ?? img.uploader ?? "").toLowerCase();

            // format createdAt to locale date string for comparison
            let dateStr = "";
            try {
                if (img.createdAt) {
                    dateStr = new Date(img.createdAt).toLocaleDateString();
                }
            } catch (e) {
                dateStr = String(img.createdAt ?? "").toLowerCase();
            }

            const dateLower = String(dateStr).toLowerCase();

            return (
                title.includes(q) ||
                uploadedBy.includes(q) ||
                dateLower.includes(q)
            );
        });
    }, [images, searchTerm]);

    // Non-optimistic like: call server, then update displayed count from server response
    async function handleLike(id) {
        try {
            const res = await fetch(`/api/increaseLikesCount/${id}`, {
                method: "PUT", // server expects PUT
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Type: "Images" }) // send Type exactly as server expects
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error || err?.message || `HTTP ${res.status}`);
            }

            const body = await res.json(); // server currently returns { message, data } — see note
            // if your server returns { message, data: updated }:
            const updated = body.data ?? body.image ?? body;
            // update UI (compare string ids)
            setImages(prev => prev.map(img => (String(img._id) === String(id) ? updated : img)));
        } catch (err) {
            console.error("Like error:", err);
        }
    }

    // Download handler: open the url (and optionally increment server-side counter — commented)
    async function handleDownload(id, url) {
        try {
            // Optional: call server to increment downloads:
            // await fetch(`/api/increaseDownloadsCount/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ Type: "Images" }) });

            // Open Cloudinary (or provided) URL
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (err) {
            console.error("Download error:", err);
            // still attempt to open url even if counting fails
            window.open(url, "_blank", "noopener,noreferrer");
        }
    }

    // UI: early returns after hooks and memo
    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center text-gray-600 h-40">
                Loading images...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex justify-center items-center text-red-600 h-40">
                Error: {error}
            </div>
        );
    }

    if (!images || images.length === 0) {
        return (
            <div className="p-6 flex justify-center items-center text-gray-600 h-40">
                No images found.
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center mb-6 gap-4 justify-start">
                {/* Title */}
                <h1 className="text-2xl font-semibold">Images</h1>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by title, author or date..."
                    className="lg:mx-16 px-4 py-2 w-72 border rounded-lg bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* If search yields no results, show friendly message */}
            {filteredImages.length === 0 ? (
                <div className="p-6 flex justify-center items-center text-gray-600 h-40">
                    No results for "{searchTerm}"
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredImages.map((img) => (
                        <ImageCard
                            key={img._id || img.id || img.cloudinaryUrl}
                            image={img}
                            onLike={handleLike}
                            onDownload={handleDownload}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
