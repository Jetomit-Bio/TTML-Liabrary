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
        <div className="flex flex-wrap justify-center items-center gap-y-3 gap-x-4 md:gap-x-6 text-sm font-semibold tracking-wide uppercase text-center">
          <Link href="/docs" className="text-neutral-400 hover:text-white transition-colors duration-200">API Documentation</Link>
          <span className="text-neutral-800 text-xs hidden sm:inline">●</span>
          <a href="https://www.paypal.com/paypalme/JetomitBio" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-200">Donate</a>
          <span className="text-neutral-800 text-xs hidden sm:inline">●</span>
          <Link href="/add" className="text-neutral-400 hover:text-white transition-colors duration-200">Add your lyrics</Link>
          <span className="text-neutral-800 text-xs hidden sm:inline">●</span>
          <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors duration-200">Terms of Service</Link>
        </div>

        {/* GitHub Open Source Button */}
        <div className="pt-8 flex justify-center w-full">
          <a
            href="https://github.com/Jetomit-Bio/TTML-Liabrary"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 bg-neutral-900 hover:bg-neutral-850 border border-white/[0.04] hover:border-white/[0.12] text-white px-6 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-lg shadow-black/40 hover:scale-[1.03] hover:shadow-indigo-500/5 cursor-pointer"
          >
            <svg role="img" viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white group-hover:text-neutral-200 transition-colors" xmlns="http://www.w3.org/2000/svg">
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span>TTMLLIB IS NOW OPEN-SOURCE!</span>
          </a>
        </div>
      </main>
    </div>
  );
}
