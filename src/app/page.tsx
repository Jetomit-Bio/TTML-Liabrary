"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans antialiased min-h-screen relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* ========================================== */}
      {/* HLAVNÁ STRÁNKA (Home View)                 */}
      {/* ========================================== */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 w-full max-w-3xl mx-auto transition-all duration-300 animate-fade-in">
        
        {/* Logo bez pozadia */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-32 h-32 mb-6 flex items-center justify-center cursor-pointer" onClick={() => router.push("/")}>
            <img
              src="/ttmllogo.svg"
              alt="TTMLLIB Logo"
              className="w-32 h-32 object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full relative mb-10 max-w-2xl">
          <div className="flex items-center bg-neutral-900/90 backdrop-blur-md rounded-full border border-neutral-800 shadow-xl overflow-hidden focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search for tracks, artists, or albums..."
              className="w-full bg-transparent text-white py-4 pl-7 pr-4 focus:outline-none text-lg placeholder-neutral-500"
              autoComplete="off"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white p-3.5 mr-1.5 rounded-full transition-all duration-200 shadow-lg shadow-indigo-600/20 hover:scale-105 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Spodné Linky */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-semibold tracking-wide uppercase">
          <Link href="/docs" className="text-neutral-400 hover:text-white transition-colors duration-200">API Documentation</Link>
          <span className="text-neutral-800 text-xs">●</span>
          <a href="https://www.paypal.com/paypalme/JetomitBio" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-200">Donate</a>
          <span className="text-neutral-800 text-xs">●</span>
          <Link href="/add" className="text-neutral-400 hover:text-white transition-colors duration-200">Add your lyrics</Link>
        </div>
      </main>
    </div>
  );
}
