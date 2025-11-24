"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {

    const router = useRouter()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleLogin(e) {

        e.preventDefault();

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });


            const data = await res.json();
            
            if (data.ok && data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("username", data.user.username);
                router.push("/profile")
            }
            setMessage(data.message);
        }
        catch (error) {
            alert("Error in login try after Some time")
            console.log("Error in login try after Some time")
        }
    }

    return (
        <div className="min-h-screen flex items-start justify-center pt-20 bg-black text-white px-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm bg-black border border-white p-6 rounded-xl shadow-lg"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

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
                    Login
                </button>

                {message && (
                    <p className="text-center text-sm mt-4 text-gray-300">{message}</p>
                )}


            </form>
        </div>
    );
}
