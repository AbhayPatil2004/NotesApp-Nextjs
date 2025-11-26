"use client";

import { useEffect, useMemo, useState } from "react";
import CodeCard from "@/components/CodeCard";

export default function CodesPage() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // search state
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let mounted = true;

        async function fetchCodes() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/api/fetchData/fetchTextContent");
                if (!res.ok) {
                    const errBody = await res.json().catch(() => ({}));
                    throw new Error(errBody?.message || `HTTP ${res.status}`);
                }

                const payload = await res.json();

                const dataArray =
                    payload?.fetchedData ??
                    payload?.codes ??
                    payload?.data ??
                    payload?.items ??
                    [];

                if (mounted) setCodes(Array.isArray(dataArray) ? dataArray : []);
            } catch (err) {
                if (mounted) setError(err.message || "Failed to load codes");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchCodes();
        return () => {
            mounted = false;
        };
    }, []);

    // Keep hooks order stable: useMemo must be called on every render (before any early returns)
    const filteredCodes = useMemo(() => {
        const q = (searchTerm || "").trim().toLowerCase();
        if (!q) return codes;

        return codes.filter((c) => {
            const title = String(c.title ?? "").toLowerCase();
            const uploadedBy = String(c.uploadedBy ?? c.user ?? "").toLowerCase();

            // format createdAt to locale date string for comparison
            let dateStr = "";
            try {
                if (c.createdAt) {
                    dateStr = new Date(c.createdAt).toLocaleDateString();
                }
            } catch (e) {
                dateStr = String(c.createdAt ?? "").toLowerCase();
            }

            const dateLower = String(dateStr).toLowerCase();

            return (
                title.includes(q) ||
                uploadedBy.includes(q) ||
                dateLower.includes(q)
            );
        });
    }, [codes, searchTerm]);

    // Like Handler (robust to different server return shapes)
    async function handleLike(id) {
        try {
            const res = await fetch(`/api/increaseLikesCount/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Type: "textContent" }),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(errBody?.message || `HTTP ${res.status}`);
            }

            const body = await res.json();
            const updated =
                body?.data ??
                body?.code ??
                body?.updated ??
                body?.fetchedData ??
                body;

            const updatedObj = Array.isArray(updated) ? updated.find(i => String(i._id) === String(id)) : updated;

            setCodes(prev =>
                prev.map(item => (String(item._id) === String(id) ? updatedObj ?? item : item))
            );
        } catch (err) {
            console.error("Like error:", err);
        }
    }

    // Download Handler (kept for compatibility though CodeCard may not use it)
    async function handleDownload(id, content) {
        try {
            const text = typeof content === "string" ? content : JSON.stringify(content, null, 2);
            const blob = new Blob([text], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(id || "code")}.txt`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download error:", err);
        }
    }

    // UI: early returns after hooks
    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center text-gray-300 h-40">
                Loading Codes...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 flex justify-center items-center text-red-400 h-40">
                Error: {error}
            </div>
        );
    }

    if (!codes || codes.length === 0) {
        return (
            <div className="p-6 flex justify-center items-center text-gray-300 h-40">
                Codes not found.
            </div>
        );
    }

    return (
        <div className="p-6 text-white">
            <div className="flex items-center mb-6 gap-4 justify-start">
                {/* Title */}
                <h1 className="text-2xl font-semibold">Codes</h1>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search by title, author or date..."
                    className="lg:mx-16 px-4 py-2 w-72 border rounded-lg bg-white text-black shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>


            {/* If search yields no results, show friendly message */}
            {filteredCodes.length === 0 ? (
                <div className="p-6 flex justify-center items-center text-gray-300 h-40">
                    No results for "{searchTerm}"
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCodes.map((code) => (
                        <CodeCard
                            key={code._id || code.id}
                            code={code}
                            onLike={handleLike}
                        // onDownload={handleDownload}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
