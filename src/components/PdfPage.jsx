// components/PdfPage.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import PdfCard from "@/components/PdfCard";

export default function PdfPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // search state
  const [searchTerm, setSearchTerm] = useState("");

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
                : Array.isArray(payload.fetchedData) ? payload.fetchedData
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

  // Keep hooks order stable: useMemo called on every render (before early returns)
  const filteredPdfs = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return pdfs;

    return pdfs.filter((p) => {
      const title = String(p.title ?? "").toLowerCase();
      const uploadedBy = String(p.uploadedBy ?? p.user ?? p.uploader ?? "").toLowerCase();

      // format createdAt to locale date string for comparison
      let dateStr = "";
      try {
        if (p.createdAt) {
          dateStr = new Date(p.createdAt).toLocaleDateString();
        }
      } catch (e) {
        dateStr = String(p.createdAt ?? "").toLowerCase();
      }
      const dateLower = String(dateStr).toLowerCase();

      return (
        title.includes(q) ||
        uploadedBy.includes(q) ||
        dateLower.includes(q)
      );
    });
  }, [pdfs, searchTerm]);

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
      if (updated) setPdfs(prev => prev.map(p => (String(p._id) === String(id) ? updated : p)));
    } catch (err) {
      console.error("Like error:", err);
    }
  }

  async function handleDownload(id, url) {
    try {
      // Optional: increment downloads on server (commented)
      // const res = await fetch(`/api/increaseDownloadsCount/${id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ Type: "Pdfs" }),
      // });
      // if (res.ok) { const body = await res.json(); const updated = body.data ?? body.pdf ?? body; if (updated) setPdfs(prev => prev.map(p => (String(p._id) === String(id) ? updated : p))); }
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

  // UI: early returns after hooks & memo
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center text-gray-600 h-40">
        Loading PDFs...
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

  if (!pdfs || pdfs.length === 0) {
    return (
      <div className="p-6 flex justify-center items-center text-gray-600 h-40">
        No PDFs found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6 gap-4 justify-start">
        {/* Title */}
        <h1 className="text-2xl font-semibold">Pdfs</h1>

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
      {filteredPdfs.length === 0 ? (
        <div className="p-6 flex justify-center items-center text-gray-600 h-40">
          No results for "{searchTerm}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPdfs.map((pdf) => (
            <PdfCard
              key={pdf._id || pdf.id || pdf.cloudinaryUrl}
              image={pdf}
              onLike={handleLike}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}
