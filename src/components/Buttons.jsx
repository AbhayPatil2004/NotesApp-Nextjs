// components/buttons.jsx
"use client";

import { useRouter } from "next/navigation";

export default function Buttons() {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full max-w-xl">

        <button
          onClick={() => router.push("/codes")}
          className="bg-white text-black px-4 py-2 text-lg rounded-md cursor-pointer shadow w-full text-center min-w-[120px]"
        >
          Codes
        </button>

        <button
          onClick={() => router.push("/images")}
          className="bg-white text-black px-4 py-2 text-lg rounded-md cursor-pointer shadow w-full text-center min-w-[120px]"
        >
          Images
        </button>

        <button
          onClick={() => router.push("/pdf")}
          className="bg-white text-black px-4 py-2 text-lg rounded-md cursor-pointer shadow w-full text-center min-w-[120px]"
        >
          Pdf
        </button>

        <button
          onClick={() => router.push("/upload")}
          className="bg-white text-black px-4 py-2 text-lg rounded-md cursor-pointer shadow w-full text-center whitespace-nowrap min-w-[140px]"
        >
          Upload Notes
        </button>

      </div>
    </div>

  );
}
