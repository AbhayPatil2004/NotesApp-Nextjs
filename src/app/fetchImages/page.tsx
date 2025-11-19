"use client"

import React, { useEffect, useState } from "react";

export default function ImageGalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fetchImages"); // replace with your API path if different
      const json = await res.json();

      if (!res.ok) throw new Error(json?.message || `Request failed with status ${res.status}`);

      setImages(Array.isArray(json?.images) ? json.images : json?.images || []);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-6 font-sans text-gray-800">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Image Gallery</h1>

        <div>
          <button
            onClick={fetchImages}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white text-sm shadow-sm hover:shadow focus:outline-none disabled:opacity-60"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          <strong className="mr-1">Error:</strong> {error}
        </div>
      )}

      {!loading && images.length === 0 && !error && (
        <div className="text-center text-gray-500 py-12">No images found.</div>
      )}

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((img) => (
          <article key={img._id || img.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <a href={img.cloudinaryUrl || img.url || img.signedUrl} target="_blank" rel="noreferrer">
              <img
                src={img.cloudinaryUrl || img.url || img.signedUrl}
                alt={img.title || "image"}
                className="w-full h-44 object-cover block bg-gray-100"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.png"; // add placeholder to public/ if you want
                }}
              />
            </a>

            <div className="p-4 flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-medium truncate">{img.title}</h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-3">{img.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>By: {img.uploadedBy}</span>
                <span>Category: {img.category || "General"}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>❤️ {img.likes ?? 0}</span>
                <span>⬇️ {img.downloads ?? 0}</span>
              </div>

              {Array.isArray(img.tags) && img.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {img.tags.map((t, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-full border bg-gray-50">{t}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <small>Uploaded: {new Date(img.createdAt || img.updatedAt || Date.now()).toLocaleString()}</small>
                <a href={`/image/${img._id || img.id}`} className="text-blue-600 underline text-sm">Details</a>
              </div>
            </div>
          </article>
        ))}
      </main>

      <footer className="mt-6 text-center text-gray-500">Fetched {images.length} images</footer>
    </div>
  );
}
