"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Buttons() {
  const router = useRouter();
  const pathname = usePathname(); // detect the active route

  const buttonClass = (path) =>
    `cursor-pointer px-2 py-2 sm:px-4 sm:py-3 rounded-md font-medium transition-all duration-200 hover:scale-105
     ${pathname === path ? "bg-blue-600 text-white" : "bg-white text-black hover:bg-gray-200"}`;

  return (
    <div className="w-full flex justify-center mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl">

        <button onClick={() => router.push("/codes")} className={buttonClass("/codes")}>
          Codes
        </button>

        <button onClick={() => router.push("/images")} className={buttonClass("/images")}>
          Images
        </button>

        <button onClick={() => router.push("/pdf")} className={buttonClass("/pdf")}>
          Pdf
        </button>

        <button
          onClick={() => router.push("/upload")}
          className={`whitespace-nowrap min-w-[120px] ${buttonClass("/upload")}`}
        >
          Upload Notes
        </button>

      </div>
    </div>
  );
}
