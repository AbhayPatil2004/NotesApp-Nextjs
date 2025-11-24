"use client";

import { useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(e) {

    try {
      e.preventDefault();

      const res = await fetch("/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name, email, password }),
      });

      const data = await res.json();

      if (data.ok && data.safeUser) {
        localStorage.setItem("user", JSON.stringify(data.safeUser));
        localStorage.setItem("name", data.safeUser.name);
        router.push("/profile")
      }
      setMessage(data.message);
    }
    catch (error) {
      alert("Error in Signup try after Some time")
      console.log("Error in Signup try after Some time")
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-black text-white px-4">
      {/* Added px-4 for mobile padding */}
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm bg-black border border-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Signup</h2>

        <input
          type="text"
          placeholder="name"
          value={Name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full mb-4 px-3 py-3 bg-black border border-white rounded-md text-white focus:outline-none text-sm sm:text-base"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-3 bg-black border border-white rounded-md text-white focus:outline-none text-sm sm:text-base"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-3 py-3 bg-black border border-white rounded-md text-white focus:outline-none text-sm sm:text-base"
        />

        <button
          type="submit"
          className="cursor-pointer w-full bg-white text-black py-3 rounded-md font-semibold hover:bg-gray-200 transition text-sm sm:text-base"
        >
          Create Account
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-gray-300">{message}</p>
        )}

        <p className="text-center mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-white underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
