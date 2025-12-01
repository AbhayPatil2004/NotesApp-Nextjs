"use client";

import React, { useEffect, useState } from "react";

// MyUploadsPage.jsx
// Single-file example page + component that shows user's uploads (image / code / pdf)
// - Tailwind CSS classes (dark / black background)
// - Responsive (mobile-first)
// - Add / Delete actions (simple modal + optimistic UI)

export default function MyUploadsPage({ userNameProp }) {
  const [userName, setUserName] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      try {
        const parsed = JSON.parse(stored);
        return parsed?.username || parsed?.userName || null;
      } catch (e) {
        return null;
      }
    }
    try {
      const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      return params.get("userName") || params.get("username") || "demoUser";
    } catch (e) {
      return "demoUser";
    }
  });

  const [items, setItems] = useState([]); // unified list of { id, type, title, desc, body, createdAt }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // modal state for Add
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ type: "image", title: "", desc: "", url: "" });

  useEffect(() => {
    if (!userName) {
      if (typeof window !== "undefined") window.location.href = "auth/signup";
      return;
    }
    fetchAll();
  }, [userName]);

  async function fetchAll() {
    setLoading(true);
    setError("");

    try {
      const endpoints = [
        `/api/myUploads/codes/${encodeURIComponent(userName)}`,
        `/api/myUploads/images/${encodeURIComponent(userName)}`,
        `/api/myUploads/pdfs/${encodeURIComponent(userName)}`,
      ];

      const [codesRes, imagesRes, pdfsRes] = await Promise.all(endpoints.map((ep) => fetch(ep)));

      const codesJson = codesRes.ok ? await codesRes.json() : { body: [] };
      const imagesJson = imagesRes.ok ? await imagesRes.json() : { body: [] };
      const pdfsJson = pdfsRes.ok ? await pdfsRes.json() : { body: [] };

      // normalize into unified items
      const normalized = [];

      if (Array.isArray(codesJson.body)) {
        codesJson.body.forEach((c) => {
          normalized.push({ id: c._id || c.id || Math.random(), type: "code", title: c.title || c.fileName || "Code", desc: c.description || "", body: c.code || c.content || c.body || c, createdAt: c.createdAt });
        });
      }

      if (Array.isArray(imagesJson.body)) {
        imagesJson.body.forEach((i) => {
          normalized.push({ id: i._id || i.id || Math.random(), type: "image", title: i.title || i.fileName || "Image", desc: i.description || "", body: i.url || i.secure_url || i.path || i, createdAt: i.createdAt });
        });
      }

      if (Array.isArray(pdfsJson.body)) {
        pdfsJson.body.forEach((p) => {
          normalized.push({ id: p._id || p.id || Math.random(), type: "pdf", title: p.title || p.fileName || "PDF", desc: p.description || "", body: p.url || p.path || p, createdAt: p.createdAt });
        });
      }

      // sort by createdAt desc if present
      normalized.sort((a, b) => {
        const da = new Date(a.createdAt || 0).getTime();
        const db = new Date(b.createdAt || 0).getTime();
        return db - da;
      });

      setItems(normalized);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch uploads");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(item) {
    // optimistic UI: remove immediately
    const prev = items.slice();
    setItems((s) => s.filter((it) => it.id !== item.id));

    try {
      // assume endpoints like /api/myUploads/{type}/{id}
      const endpoint = `/api/myUploads/${item.type}/${encodeURIComponent(item.id)}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      setItems(prev); // revert
      alert("Delete failed — please try again");
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    // very simple add: POST to /api/myUploads/{type}
    const payload = {
      title: newItem.title,
      description: newItem.desc,
      url: newItem.url,
      uploadedBy: userName,
    };

    // optimistic add locally with temporary id
    const temp = { id: `temp-${Date.now()}`, type: newItem.type, title: newItem.title, desc: newItem.desc, body: newItem.url, createdAt: new Date().toISOString() };
    setItems((s) => [temp, ...s]);
    setShowAddModal(false);
    setNewItem({ type: "image", title: "", desc: "", url: "" });

    try {
      const res = await fetch(`/api/myUploads/${newItem.type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Add failed");

      // replace temp with real response (if available)
      const json = await res.json();
      if (json && json.body) {
        setItems((s) => s.map((it) => (it.id === temp.id ? { ...json.body, id: json.body._id || json.body.id } : it)));
      }
    } catch (err) {
      console.error(err);
      // remove temp
      setItems((s) => s.filter((it) => it.id !== temp.id));
      alert("Add failed — please try again");
    }
  }

  return (
    <div className=" bg-black text-white p-4 sm:p-8">
      <div className=" mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold">My Uploads</h1>
          <div className="flex items-center gap-3">
            {/* <button
              onClick={() => setShowAddModal(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md text-sm"
            >
              + Add
            </button>
            <button
              onClick={fetchAll}
              className="bg-white/5 hover:bg-white/10 text-sm px-3 py-2 rounded-md"
            >
              Refresh
            </button> */}
          </div>
        </header>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-10">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No uploads yet</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <UploadCard key={item.id} item={item} onDelete={() => handleDelete(item)} />
            ))}
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
          <form onSubmit={handleAdd} className="w-full max-w-lg bg-gray-900 rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-medium mb-4">Add Upload</h2>

            <label className="block mb-2 text-sm">Type</label>
            <select className="w-full mb-4 p-2 bg-black/30 rounded" value={newItem.type} onChange={(e) => setNewItem((s) => ({ ...s, type: e.target.value }))}>
              <option value="image">Image</option>
              <option value="code">Code</option>
              <option value="pdf">PDF</option>
            </select>

            <label className="block mb-2 text-sm">Title</label>
            <input required value={newItem.title} onChange={(e) => setNewItem((s) => ({ ...s, title: e.target.value }))} className="w-full mb-3 p-2 bg-black/30 rounded" />

            <label className="block mb-2 text-sm">Description</label>
            <textarea value={newItem.desc} onChange={(e) => setNewItem((s) => ({ ...s, desc: e.target.value }))} className="w-full mb-3 p-2 bg-black/30 rounded" rows={3} />

            <label className="block mb-2 text-sm">URL / Content (for code put raw code or gist url)</label>
            <input required value={newItem.url} onChange={(e) => setNewItem((s) => ({ ...s, url: e.target.value }))} className="w-full mb-4 p-2 bg-black/30 rounded" />

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-2 rounded bg-white/10">Cancel</button>
              <button type="submit" className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700">Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function UploadCard({ item, onDelete }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 flex flex-col h-full border border-white/5">
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 flex-shrink-0 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
          {item.type === "image" ? (
            // image thumbnail
            <img src={String(item.body)} alt={item.title} className="object-cover w-full h-full" />
          ) : item.type === "code" ? (
            <div className="p-2 text-xs leading-tight text-left w-full h-full overflow-hidden">
              <pre className="whitespace-pre-wrap text-sm">{String(item.body).slice(0, 200)}</pre>
            </div>
          ) : (
            // pdf icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor" className="text-white/80">
              <path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-medium truncate">{item.title}</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">{item.desc}</p>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-white/5 text-white/80">{item.type.toUpperCase()}</span>
            {item.createdAt && <span className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <a
          href={typeof item.body === "string" ? item.body : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm bg-white/5 px-3 py-2 rounded hover:bg-white/10"
        >
          Open
        </a>

        <div className="cursor-pointer flex items-center gap-2">
          <button onClick={onDelete} className="cursor-pointer text-sm px-3 py-2 rounded bg-red-600 hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
}
