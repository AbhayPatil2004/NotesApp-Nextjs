"use client";

import { useState, useEffect } from "react";

export default function PDFUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedBy, setUploadedBy] = useState("");

  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData?.username) setUploadedBy(userData.username);
    } catch (err) {
      // invalid or missing localStorage entry
    }
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      alert("Please select a PDF file");
      return;
    }
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", e.target.title.value);
    formData.append("description", e.target.description.value);
    formData.append("uploadedBy", uploadedBy);
    formData.append("category", e.target.category.value);

    try {
      const res = await fetch("/api/uploadData/pdfUpload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.ok) {
        alert("PDF uploaded successfully!");
        // optionally reset form
        e.target.reset();
        setFile(null);
        setPreviewUrl("");
      } else {
        alert("Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading PDF");
    }

    setLoading(false);
  };

  return (
    <div className="bg-black text-white flex justify-center p-4 px-0 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-neutral-900 p-6 rounded-xl shadow-lg space-y-4 border border-neutral-700"
      >
        <h2 className="text-2xl font-semibold text-center">Upload PDF</h2>

        <label className="block">
          <span className="text-sm text-gray-300">Select PDF</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mt-1 w-full text-gray-200 bg-neutral-800 p-2 rounded border border-neutral-700 cursor-pointer"
          />
        </label>

        {previewUrl ? (
          <div className="w-full h-64 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-800">
            <iframe
              src={previewUrl}
              title="pdf-preview"
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="w-full h-20 flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 text-gray-300">
            No preview available
          </div>
        )}

        <input
          name="title"
          placeholder="Title"
          required
          className="w-full p-2 bg-neutral-800 rounded border border-neutral-700 text-white"
        />

        <textarea
          name="description"
          placeholder="Description"
          required
          className="w-full p-2 bg-neutral-800 rounded border border-neutral-700 text-white"
        />

        <input
          name="category"
          placeholder="Category (optional)"
          className="w-full p-2 bg-neutral-800 rounded border border-neutral-700 text-white"
        />

        <div className="text-sm text-gray-400">
          Uploaded by: {uploadedBy || "not found"}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold disabled:bg-gray-600"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
    </div>

  );
}
