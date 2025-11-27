"use client";

import { useEffect, useState } from "react";

export default function TextCodeUploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [content, setContent] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.username) {
          setUploadedBy(parsed.username);
          return;
        }
      }
    } catch (err) {
      // ignore parse errors
    }
    setUploadedBy(""); // fallback to empty
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setContent(String(reader.result || ""));
    };
    reader.onerror = () => {
      alert("Failed to read file");
    };
    reader.readAsText(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadedBy) {
      alert("No user found in localStorage (user.username). Please login or set localStorage.");
      return;
    }
    if (!title.trim() || !description.trim() || !content.trim()) {
      alert("Please fill Title, Description and Content.");
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      uploadedBy: uploadedBy,
      // your backend uses 'category' — you asked for 'language', send it as 'category' or both
      // Backend you shared uses `category` field; we'll send language as 'category' so it maps to the schema.
      category: language?.trim() || "General",
      content: content,
      // do NOT include comments
    };

    try {
      const res = await fetch("/api/uploadData/textUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data?.status === "success") {
        alert("Text uploaded successfully!");
        setTitle("");
        setDescription("");
        setLanguage("");
        setContent("");
      } else {
        const msg = data?.message || data?.error || JSON.stringify(data);
        alert("Upload failed: " + msg);
      }
    } catch (err) {
      console.error(err);
      alert("Network or server error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-neutral-900 p-6 rounded-xl shadow-lg space-y-4 border border-neutral-700"
      >
        <h2 className="text-2xl font-semibold text-center">Upload Text / Code</h2>

        <div>
          <label className="text-sm text-gray-300 block mb-1">Upload file (optional)</label>
          <input
            type="file"
            accept=".txt,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.json,.md"
            onChange={handleFileChange}
            className="w-full p-2 bg-neutral-800 rounded border border-neutral-700 text-white"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-1">Or paste content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your code or text here..."
            rows={12}
            className="w-full p-3 bg-neutral-800 rounded border border-neutral-700 text-white font-mono"
          />
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          placeholder="Title"
          required
          className="w-full p-2 bg-neutral-800 rounded border border-neutral-700 text-white"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="description"
          placeholder="Description"
          required
          className="w-full p-2 bg-neutral-800 rounded border border-neutral-700 text-white"
        />

        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          name="language"
          placeholder="Language (e.g. JavaScript, Python) - optional"
          className="w-full p-2 bg-neutral-800 rounded border border-neutral-700 text-white"
        />

        <div className="text-sm text-gray-400">Uploaded by: {uploadedBy || "not found"}</div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold disabled:bg-gray-600"
        >
          {loading ? "Uploading..." : "Upload Text"}
        </button>
      </form>
    </div>
  );
}
