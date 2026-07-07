"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { searchTracks, Track } from "@/app/actions";
import Link from "next/link";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [keyword, setKeyword] = useState(initialQuery);
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    setLoading(true);
    setKeyword(trimmed);
    try {
      const tracks = await searchTracks(trimmed);
      setResults(tracks);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchInput(initialQuery);
    fetchResults(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = () => {
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto p-6 pt-12 min-h-screen transition-all duration-300 animate-fade-in">
      {/* Tlačidlo Back to Home */}
      <button
        onClick={() => router.push("/")}
        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold mb-8 transition-colors text-xs tracking-wider uppercase hover:scale-105 origin-left duration-200 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        BACK TO HOME
      </button>

      {/* Horný Search Bar na stránke výsledkov */}
      <div className="flex items-center gap-4 mb-10 w-full max-w-3xl">
        {/* Small branding logo */}
        <div className="shrink-0 cursor-pointer" onClick={() => router.push("/")}>
          <img
            src="/ttmllogo.svg"
            alt="TTMLLIB Logo"
            className="w-12 h-12 object-contain hover:scale-105 transition-transform"
          />
        </div>
        
        <div className="flex-grow bg-neutral-900/90 backdrop-blur-md rounded-full flex items-center p-1.5 shadow-lg border border-neutral-800 focus-within:border-indigo-500/80 transition-all duration-200">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
            className="flex-grow bg-transparent text-white px-6 py-2 focus:outline-none text-lg placeholder-neutral-500"
            autoComplete="off"
          />
          <button
            onClick={handleSearchSubmit}
            className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-full p-3 transition-all duration-200 hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nadpis vyhľadávania */}
      <h2 className="text-xl text-neutral-400 mb-8 border-b border-neutral-800 pb-4">
        Search for keyword: <span className="text-indigo-400 font-bold text-2xl ml-2">{keyword}</span>
      </h2>

      {/* Stav načítania */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm font-medium animate-pulse">Searching the database...</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {results.length > 0 ? (
            results.map((track) => (
              <Link
                key={track.id}
                href={`/lyrics/${track.id}`}
                className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800/80 rounded-xl p-5 flex justify-between items-center hover:bg-neutral-800/50 hover:border-neutral-700 transition-all duration-250 cursor-pointer shadow-md group block"
              >
                <div className="flex-grow">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-indigo-300 transition-colors">
                    {track.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="bg-indigo-950/80 border border-indigo-900/60 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {track.duration}
                    </span>
                    {track.type === "Synced" ? (
                      <span className="bg-emerald-950/80 border border-emerald-900/60 text-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Synced
                      </span>
                    ) : (
                      <span className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        Plain
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-400 text-sm font-medium">
                    {track.album ? `${track.album} - ` : ""}{track.artist}
                  </p>
                </div>
                <div className="text-indigo-400 hover:text-indigo-300 bg-neutral-900 border border-neutral-850 p-2.5 rounded-full shadow group-hover:bg-indigo-600 group-hover:text-white transition-all duration-250">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-16 bg-neutral-900/20 border border-dashed border-neutral-800 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-neutral-400 font-semibold text-lg mb-1">No lyrics found</p>
              <p className="text-neutral-500 text-sm">We couldn't find any results for "{keyword}". Try again or add new lyrics.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans antialiased min-h-screen relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm font-medium animate-pulse">Loading search results...</p>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}
