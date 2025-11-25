// components/PdfPage.jsx
"use client";

import { useEffect, useState } from "react";
import PdfCard from "@/components/PdfCard";

export default function PdfPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchPdfs() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/fetchData/fetchPdfs", { signal });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || `HTTP ${res.status}`);
        }

        const payload = await res.json();
        const list =
          Array.isArray(payload.Pdfs) ? payload.Pdfs
            : Array.isArray(payload.pdfs) ? payload.pdfs
              : Array.isArray(payload.data) ? payload.data
                : [];
        setPdfs(list);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load PDFs");
      } finally {
        setLoading(false);
      }
    }

    fetchPdfs();
    return () => controller.abort();
  }, []);

  async function handleLike(id) {
    try {
      const res = await fetch(`/api/increaseLikesCount/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Type: "Pdfs" }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || err?.message || `HTTP ${res.status}`);
      }

      const body = await res.json();
      const updated = body.data ?? body.image ?? body.pdf ?? body;
      if (updated) setPdfs(prev => prev.map(p => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Like error:", err);
    }
  }

  async function handleDownload(id, url) {
    try {
    //   const res = await fetch(`/api/increaseDownloadsCount/${id}`, {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ Type: "Pdfs" }),
    //   });

    //   if (!res.ok) {
    //     const err = await res.json().catch(() => ({}));
    //     throw new Error(err?.error || err?.message || `HTTP ${res.status}`);
    //   }

    //   const body = await res.json();
    //   const updated = body.data ?? body.image ?? body.pdf ?? body;
    //   if (updated) setPdfs(prev => prev.map(p => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Download count error:", err);
    } finally {
      // open the file in a new tab (do this after trying to increment count)
      try {
        window.open(url, "_blank", "noopener,noreferrer");
      } catch (openErr) {
        console.error("Failed to open URL:", openErr);
      }
    }
  }

  if (loading) return (
    <div className="p-6 flex justify-center">
      <div className="text-gray-600">Loading PDFs...</div>
    </div>
  );

  if (error) return (
    <div className="p-6 flex justify-center">
      <div className="text-red-600">Error: {error}</div>
    </div>
  );

  if (!pdfs || pdfs.length === 0) return (
    <div className="p-6 flex justify-center">
      <div className="text-gray-600">No PDFs found.</div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Pdfs</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pdfs.map((img) => (
          <PdfCard
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
