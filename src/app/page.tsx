"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";


export default function Home() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const u = username.trim();
    const p =password.trim();

    if (!u || !p ){
      setError("Please enter both username and password.");
      return;
    }

    setError("");
    const res = await fetch("api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/game");
      return;
    }

    const data = await res.json().catch(() => ({}));
    setError(data.error ?? "Sign in failed.");
  }
  
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-3xl bg-gray-200 border border-gray-300 shadow-sm p-8">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold text-center">Sign In</h1>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-10 rounded-md border border-gray-300 px-3 bg-white"
          />
        </div>

        <button
          type="submit"
          className="h-10 rounded-xl bg-green-400 font-semibold mt-2"
        >
          Sign In
        </button>
        
        <Link
          href="/signup"
          className="h-10 rounded-xl border border-gray-300 bg-white font-semibold flex items-center justify-center"
        >
          Sign Up
        </Link>
      </form>
      </div>
    </main>
  );
}