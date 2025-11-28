"use client";

import React from "react";
import { useRouter } from "next/navigation"
import FeaturesSection from "@/components/FeaturesSection";

export default function LearningHero() {

  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Decorative soft circles */}
      <div className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-white/3 blur-3xl pointer-events-none" />
      <div className="absolute right-[-120px] top-40 w-80 h-80 rounded-full bg-white/2 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full bg-white/3 blur-3xl pointer-events-none" />

      {/* Center container */}
      <div className="max-w-4xl mx-auto px-6 pb-20 relative z-10">
        {/* Search pill */}
        {/* <div className="flex justify-center mt-10">
          <form className="flex items-center gap-3 w-full max-w-2xl">
            <div className="flex items-center flex-1 bg-transparent border border-white/20 rounded-full px-4 py-2 shadow-inner">
              <svg
                className="w-5 h-5 text-white/60 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <input
                aria-label="Search"
                placeholder="Search notes, collections, and more..."
                className="bg-transparent w-full outline-none placeholder-white/60 text-white text-sm"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer rounded-full px-5 py-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:scale-105 transform transition shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
              <span className="text-sm font-medium">Search</span>
            </button>
          </form>
        </div>

        <p className="text-center text-white/50 text-sm mt-3">
          Try: "mathematics", "computer science", "study notes"
        </p> */}

        {/* Hero heading */}
        <header className="text-center mt-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            <span className="block">Share Knowledge,</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
              Learn Together
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-white/60 mt-6 text-base">
            Join thousands of students and educators sharing notes, documents, and study
            materials. Build your digital library and discover valuable resources from around
            the world.
          </p>

          {/* CTA row */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button className="cursor-pointer flex items-center gap-3 bg-emerald-500/90 hover:bg-emerald-500 px-5 py-3 rounded-full shadow-lg"
              onClick={() => router.push("/auth/signup")}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="black">
                <path d="M12 2a1 1 0 011 1v9a1 1 0 11-2 0V3a1 1 0 011-1zM7.05 6.05a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414zM5 19a1 1 0 110-2h14a1 1 0 110 2H5z" />
              </svg>
              <span className="font-medium text-sm">Get Started</span>
            </button>

            <button className="cursor-pointer flex items-center gap-2 text-sm text-white/80 hover:text-white"
              onClick={() => router.push("/auth/login")}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 3h4a2 2 0 012 2v4"
                />
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14L21 3"
                />
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 14v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6"
                />
              </svg>
              Sign In
            </button>
          </div>

          {/* Book icon */}
          {/* <div className="mt-12 flex justify-center">
            <div className="w-20 h-20 bg-white/8 rounded-lg flex items-center justify-center p-3">
              <svg
                viewBox="0 0 24 24"
                className="w-12 h-12 text-white/90"
                fill="currentColor"
              >
                <path d="M6 3a2 2 0 00-2 2v13a1 1 0 001.447.894L12 17l6.553 1.894A1 1 0 0020 18V5a2 2 0 00-2-2H6zM8 6h8v9l-4-.8L8 15V6z" />
              </svg>
            </div>
          </div> */}
        </header>

        {/* Stats panel */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-white/6 backdrop-blur rounded-xl p-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <StatCard number="1,250" label="NOTES" />
              <StatCard number="850" label="USERS" />
              <StatCard number="5,600" label="DOWNLOADS" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl text-center">
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition cursor-default">
            <h2 className="text-xl font-semibold mb-2">Share Your Codes</h2>
            <p className="text-gray-300">Upload your code snippets and let others copy or learn from them.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition cursor-default">
            <h2 className="text-xl font-semibold mb-2">Upload Images</h2>
            <p className="text-gray-300">Share diagrams, screenshots, or images for your notes.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition cursor-default">
            <h2 className="text-xl font-semibold mb-2">PDF Notes</h2>
            <p className="text-gray-300">Upload and download PDF notes to keep everyone learning together.</p>
          </div>
        </div>


        {/* Footer */}

      </div>

      <FeaturesSection></FeaturesSection>

      

    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="py-6 px-4">
      <div className="text-3xl sm:text-4xl font-extrabold">{number}</div>
      <div className="text-xs sm:text-sm text-white/60 mt-1">{label}</div>
    </div>
  );
}
