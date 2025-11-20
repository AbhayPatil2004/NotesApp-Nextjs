"use client";

import React, { useEffect, useState } from "react";

export default function PdfGalleryPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // track which pdf is being previewed (store id or null)
  const [previewId, setPreviewId] = useState(null);

  const fetchPdfs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fetchPdfs"); // your API path
      const json = await res.json();

      if (!res.ok) throw new Error(json?.message || `Request failed with status ${res.status}`);

      setPdfs(Array.isArray(json?.images) ? json.images : json?.images || []);
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const getPdfUrl = (item) => item.signedUrl || item.cloudinaryUrl || item.url || "";

  return (
    <div className="p-6 font-sans text-gray-800">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">PDF Gallery</h1>

        <div>
          <button
            onClick={fetchPdfs}
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

      {!loading && pdfs.length === 0 && !error && (
        <div className="text-center text-gray-500 py-12">No PDFs found.</div>
      )}

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pdfs.map((pdf) => {
          const id = pdf._id || pdf.id;
          const url = getPdfUrl(pdf);
          const previewing = previewId === id;

          return (
            <article key={id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-4 flex gap-4 items-start">
                {/* Left: icon / simple thumbnail */}
                <div className="w-20 h-28 flex-shrink-0 flex items-center justify-center bg-gray-50 border rounded text-gray-500">
                  {/* simple PDF icon & filename */}
                  <div className="text-center px-2">
                    <svg className="mx-auto mb-1" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5"/>
                      <path d="M14 2v6h6" strokeWidth="1.5"/>
                    </svg>
                    <div className="text-xs truncate">{(pdf.filename || pdf.title || "file.pdf").slice(0, 16)}</div>
                  </div>
                </div>

                {/* Right: metadata */}
                <div className="flex-1">
                  <h2 className="text-lg font-medium truncate">{pdf.title || pdf.filename || "Untitled PDF"}</h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{pdf.description || pdf.caption || ""}</p>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>By: {pdf.uploadedBy || "Unknown"}</span>
                    <span>{new Date(pdf.createdAt || pdf.updatedAt || Date.now()).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm px-3 py-2 rounded-md border bg-white shadow-sm hover:bg-gray-50"
                      onClick={() => {
                        /* If you want analytics, track open */
                      }}
                    >
                      Open
                    </a>

                    <a
                      href={url}
                      download={pdf.filename || "file.pdf"} // note: download only works if same-origin or has Content-Disposition header
                      className="text-sm px-3 py-2 rounded-md border bg-white shadow-sm hover:bg-gray-50"
                    >
                      Download
                    </a>

                    <button
                      onClick={() => setPreviewId(previewing ? null : id)}
                      className="text-sm px-3 py-2 rounded-md border bg-white shadow-sm hover:bg-gray-50"
                    >
                      {previewing ? "Close Preview" : "Preview"}
                    </button>

                    <a href={`/pdf/${id}`} className="ml-auto text-sm text-blue-600 underline">
                      Details
                    </a>
                  </div>
                </div>
              </div>

              {/* Preview area */}
              {previewing && (
                <div className="border-t p-4">
                  {url ? (
                    // Try iframe first (works when remote server allows embedding)
                    <div style={{ minHeight: 360 }} className="w-full">
                      <iframe
                        src={url}
                        title={pdf.title || pdf.filename || "PDF Preview"}
                        style={{ width: "100%", height: 540, border: "none" }}
                      />
                      {/* fallback: object tag (some servers respond better to object than iframe) */}
                      <noscript>
                        <object data={url} type="application/pdf" width="100%" height="540">
                          <p>
                            PDF preview not available. <a href={url}>Open in new tab</a>
                          </p>
                        </object>
                      </noscript>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No preview available for this file.</div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </main>

      <footer className="mt-6 text-center text-gray-500">Fetched {pdfs.length} PDFs</footer>
    </div>
  );
}
