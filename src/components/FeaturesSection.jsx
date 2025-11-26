"use client";

import React from "react";
import { FaUsers, FaSearch, FaShareAlt, FaFolder, FaMobile, FaShieldAlt } from "react-icons/fa";

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaShareAlt size={26} />,
      title: "Easy Sharing",
      desc: "Upload and share your notes, documents, and study materials with just a few clicks. Drag & drop support for seamless file uploads.",
    },
    {
      icon: <FaSearch size={26} />,
      title: "Smart Search",
      desc: "Find exactly what you need with our advanced search system. Search by keywords, categories, or tags.",
    },
    {
      icon: <FaUsers size={26} />,
      title: "Community",
      desc: "Connect with students and educators to collaborate and learn together. Rate and review content.",
    },
    {
      icon: <FaFolder size={26} />,
      title: "Collections",
      desc: "Organize your notes into custom collections. Create public or private collections for better organization.",
    },
    {
      icon: <FaMobile size={26} />,
      title: "Mobile Ready",
      desc: "Access your notes anywhere, anytime. Fully responsive design optimized for mobile and tablet devices.",
    },
    {
      icon: <FaShieldAlt size={26} />,
      title: "Secure & Private",
      desc: "Your data is protected with enterprise-grade security. Control privacy settings for your content.",
    },
  ];

  return (
    <section className="w-full bg-[#0b1120] text-white py-16 px-4">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-300">
          Why Choose E-Library?
        </h2>
        <p className="text-white/60 mt-2">
          Powerful features designed for modern learning
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <div
            key={index}
            className="
              p-8 rounded-2xl bg-[#11172a] border border-white/5 
              text-center shadow-xl transition-all duration-300
              hover:scale-[1.03] hover:shadow-purple-500/20 hover:border-purple-400/40
            "
          >
            {/* Icon */}
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white mb-4">
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            
            {/* Description */}
            <p className="text-sm text-white/60 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
