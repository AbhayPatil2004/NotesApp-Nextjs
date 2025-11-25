// components/buttons.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Buttons() {
  const router = useRouter();

  // store active button name
  const [active, setActive] = useState("");

  const handleClick = (path) => {
    setActive(path); // highlight the clicked button
    router.push(path);
  };

  const baseClass =
    "px-4 py-2 text-lg rounded-md cursor-pointer shadow w-full text-center min-w-[120px] transition";

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full max-w-xl">

        <button
          onClick={() => handleClick("/codes")}
          className={`${baseClass} ${
            active === "/codes"
              ? "bg-blue-600 text-white"
              : "bg-white text-black"
          }`}
        >
          Codes
        </button>

        <button
          onClick={() => handleClick("/images")}
          className={`${baseClass} ${
            active === "/images"
              ? "bg-blue-600 text-white"
              : "bg-white text-black"
          }`}
        >
          Images
        </button>

        <button
          onClick={() => handleClick("/pdf")}
          className={`${baseClass} ${
            active === "/pdf"
              ? "bg-blue-600 text-white"
              : "bg-white text-black"
          }`}
        >
          Pdf
        </button>

        <button
          onClick={() => handleClick("/upload")}
          className={`${baseClass} whitespace-nowrap min-w-[140px] ${
            active === "/upload"
              ? "bg-blue-600 text-white"
              : "bg-white text-black"
          }`}
        >
          Upload Notes
        </button>

      </div>
    </div>
  );
}
