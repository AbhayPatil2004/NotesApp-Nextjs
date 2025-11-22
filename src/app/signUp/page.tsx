"use client";

import React, { useState } from "react";

export default function SignupPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setMessage("Signup successful!");
      setUserName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Signup</h2>

      {message && (
        <p
          style={{
            background: "#eee",
            padding: "10px",
            borderRadius: 4,
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSignup}>
        {/* Username */}
        <label>Username</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 15,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
          required
        />

        {/* Email */}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 15,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
          required
        />

        {/* Password */}
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 20,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: loading ? "#888" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {loading ? "Creating account..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
