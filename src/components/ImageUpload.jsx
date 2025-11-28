"use client";

import { useState, useEffect } from "react";

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedBy, setUploadedBy] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.username) {
      setUploadedBy(userData.username);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", e.target.title.value);
    formData.append("description", e.target.description.value);
    formData.append("uploadedBy", uploadedBy);
    formData.append("category", e.target.category.value);
    // formData.append("comments", e.target.comments.value);

    try {
      const res = await fetch("/api/uploadData/imageUpload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.ok) {
        alert("Image uploaded successfully!");
      } else {
        alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    }

    setLoading(false);
  };

  return (
    <div className=" bg-black text-white flex justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-neutral-900 p-6 rounded-xl shadow-lg space-y-4 border border-neutral-700"
      >
        <h2 className="text-2xl font-semibold text-center">Upload Image</h2>

        <label className="block">
          <span className="text-sm text-gray-300">Select Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full text-gray-200 bg-neutral-800 p-2 rounded border border-neutral-700 cursor-pointer"
          />
        </label>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-64 object-cover rounded-lg border border-neutral-700"
          />
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

        <div className="text-sm text-gray-400">Uploaded by: {uploadedBy || "not found"}</div>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold disabled:bg-gray-600"
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </form>
    </div>
  );
}
