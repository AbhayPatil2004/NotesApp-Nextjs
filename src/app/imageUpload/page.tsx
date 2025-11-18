"use client";

import React, { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);
  const [responseJson, setResponseJson] = useState(null);

  function handleFileChange(e) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setResponseJson(null);
    if (f) {
      // image preview (works for images)
      if (f.type.startsWith("image/")) {
        const url = URL.createObjectURL(f);
        setPreview(url);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");
    setResponseJson(null);

    if (!file) {
      setStatus("Please select a file to upload.");
      return;
    }
    if (!title || !description || !uploadedBy) {
      setStatus("Please fill title, description and uploadedBy.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", title);
    fd.append("description", description);
    fd.append("uploadedBy", uploadedBy);
    fd.append("category", category);
    fd.append("tags", tags); // comma separated

    try {
      setStatus("Uploading...");

      const res = await fetch("/api/imageUpload", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      setResponseJson(json);

      if (res.ok) {
        setStatus("Upload successful!");
        // reset form (optional)
        setFile(null);
        setTitle("");
        setDescription("");
        setUploadedBy("");
        setCategory("");
        setTags("");
        setPreview(null);
      } else {
        setStatus(json?.message || json?.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("Upload error: " + (err?.message ?? err));
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Upload Image (Cloudinary test)</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">File (image / pdf)</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700"
          />
        </div>

        {preview && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <img src={preview} alt="preview" className="max-h-48 rounded-md border" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Image title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            rows={3}
            placeholder="Short description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Uploaded By</label>
            <input
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Your name or user id"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              placeholder="optional"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="nature, summer, portrait"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Upload
          </button>

          <div className="text-sm text-gray-700">{status}</div>
        </div>

        {responseJson && (
          <pre className="mt-3 p-3 bg-gray-50 rounded text-sm overflow-auto">{JSON.stringify(responseJson, null, 2)}</pre>
        )}
      </form>
    </div>
  );
}
