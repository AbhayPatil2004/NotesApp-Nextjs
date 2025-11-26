"use client";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
          Welcome to NotesShare
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8">
          Share your code snippets, images, and PDF notes with the community. 
          Download notes from others, and even copy code directly for your projects.
        </p>
      </div>

      {/* Features Section */}
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
      <div className="mt-16 text-center text-gray-500">
        &copy; {new Date().getFullYear()} NotesShare. All rights reserved.
      </div>
    </div>
  );
}
