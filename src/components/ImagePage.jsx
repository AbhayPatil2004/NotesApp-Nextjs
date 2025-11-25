// components/ImagesPage.jsx
"use client";

import { useEffect, useState } from "react";
import ImageCard from "@/components/ImageCard";

export default function ImagesPage() {

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                if (mounted) setImages(Array.isArray(payload.images) ? payload.images : payload.images || []);
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

    // Non-optimistic like: call server, then update displayed count from server response
    async function handleLike(id) {
        try {
            const res = await fetch(`/api/increaseLikesCount/${id}`, {
                method: "PUT",                       // server expects PUT
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
            // update UI
            setImages(prev => prev.map(img => (img._id === id ? updated : img)));
        } catch (err) {
            console.error("Like error:", err);
        }
    }


    // Download handler: call server to increment downloads then open the url
    async function handleDownload(id, url) {
        try {
            const res = await fetch(`/api/increaseDownloadsCount/${id}`, {
                method: "PUT", // matches server route
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Type: "Images" })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.error || err?.message || `HTTP ${res.status}`);
            }

            const body = await res.json(); // expects { ok: true, image: {...} }
            if (body?.ok && body?.image) {
                setImages(prev => prev.map(img => (img._id === id ? body.image : img)));
            }

            // finally open the Cloudinary URL in a new tab to download/view
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (err) {
            console.error("Download error:", err);
            // still attempt to open url even if counting fails
            window.open(url, "_blank", "noopener,noreferrer");
        }
    }



    if (loading) {
        return (
            <div className="p-6 flex justify-center">
                <div className="text-gray-600">Loading images...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex justify-center">
                <div className="text-red-600">Error: {error}</div>
            </div>
        );
    }

    if (!images || images.length === 0) {
        return (
            <div className="p-6 flex justify-center">
                <div className="text-gray-600">No images found.</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Gallery</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((img) => (
                    <ImageCard
                        key={img._id || img.id || img.cloudinaryUrl}
                        image={img}
                        onLike={handleLike}
                        onDownload={handleDownload}
                    />
                ))}
            </div>
        </div>
    );
}
