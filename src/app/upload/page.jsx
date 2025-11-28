"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import PDFUpload from "@/components/PdfUpload";
import CodeUpload from "@/components/CodeUpload";

export default function Page() {
  // Default selected type = "code"
  const [selectedType, setSelectedType] = useState("code");

  return (
    <div className=" bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Upload Center</h1>

      {/* Dropdown */}
      <div className="flex justify-center mb-6 ">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 text-white p-3 rounded-lg w-64 cursor-pointer"
        >
          <option value="code">Code Upload</option>
          <option value="image">Image Upload</option>
          <option value="pdf">PDF Upload</option>
        </select>
      </div>

      {/* Render Component */}
      <div className="flex justify-center">
        {selectedType === "image" && <ImageUpload />}
        {selectedType === "pdf" && <PDFUpload />}
        {selectedType === "code" && <CodeUpload />}
      </div>
    </div>
  );
}
