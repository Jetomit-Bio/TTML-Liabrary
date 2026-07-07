"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [distributor, setDistributor] = useState("WebUpload");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [durationSeconds, setDurationSeconds] = useState<number | "">("");
  const [youtubeId, setYoutubeId] = useState("");
  const [lyricsPlain, setLyricsPlain] = useState("");
  const [lyricsTtml, setLyricsTtml] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!apiKey) {
      setError("API key is required");
      setLoading(false);
      return;
    }
    if (!distributor.trim()) {
      setError("Distributor name is required");
      setLoading(false);
      return;
    }
    if (!title.trim()) {
      setError("Song title is required");
      setLoading(false);
      return;
    }
    if (!artist.trim()) {
      setError("Artist name is required");
      setLoading(false);
      return;
    }
    if (durationSeconds === "" || durationSeconds <= 0) {
      setError("Duration must be a positive number of seconds");
      setLoading(false);
      return;
    }
    if (!lyricsPlain.trim()) {
      setError("Plain text lyrics are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          distributor: distributor.trim(),
          title: title.trim(),
          artist: artist.trim(),
          album: album.trim() || null,
          duration_seconds: Number(durationSeconds),
          youtube_id: youtubeId.trim() || null,
          lyrics_plain: lyricsPlain.trim(),
          lyrics_ttml: lyricsTtml.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload track");
      }

      setSuccess(`Track uploaded successfully! Track ID: ${data.trackId}`);
      // Clear form except API key and distributor
      setTitle("");
      setArtist("");
      setAlbum("");
      setDurationSeconds("");
      setYoutubeId("");
      setLyricsPlain("");
      setLyricsTtml("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans antialiased min-h-screen relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold mb-10 transition-all text-xs tracking-wider uppercase hover:scale-105 origin-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          BACK TO SEARCH
        </Link>
        
        {/* JSON-LD for SEO / AI Search indexing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Upload Lyrics - TTMLLIB",
              "description": "Submit song lyrics in plain text or synchronized TTML format directly to TTMLLIB database.",
              "url": "https://ttmllib.xyz/upload",
              "author": {
                "@type": "Person",
                "name": "Jetomit-Bio",
                "url": "https://github.com/Jetomit-Bio"
              }
            })
          }}
        />

        {/* Header */}
        <div className="space-y-4 mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Upload Lyrics</h1>
          <p className="text-neutral-400 text-base max-w-2xl leading-relaxed">
            Submit new plain text or synchronized TTML lyrics directly to the TTMLLIB database. A valid distributor API key is required.
          </p>
        </div>

        <div className="bg-neutral-900/30 backdrop-blur-md border border-neutral-900/80 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error & Success Messages */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm font-semibold">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm font-semibold">
                ✅ {success}
              </div>
            )}

            {/* Authentication & Distributor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">API Key *</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter x-api-key"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Distributor Name *</label>
                <input
                  type="text"
                  value={distributor}
                  onChange={(e) => setDistributor(e.target.value)}
                  placeholder="e.g. SudoAPP"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Track Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Song Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Blinding Lights"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Artist *</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. The Weeknd"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Album Name</label>
                <input
                  type="text"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  placeholder="e.g. After Hours"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Duration and YouTube ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Duration (in seconds) *</label>
                <input
                  type="number"
                  value={durationSeconds}
                  onChange={(e) => setDurationSeconds(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 200"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">YouTube Video ID / URL</label>
                <input
                  type="text"
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="e.g. fHI8X4OXluQ"
                  className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Plain Lyrics */}
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Plain Text Lyrics *</label>
              <textarea
                value={lyricsPlain}
                onChange={(e) => setLyricsPlain(e.target.value)}
                placeholder="Paste plain text lyrics here..."
                rows={6}
                className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
                required
              />
            </div>

            {/* TTML Lyrics */}
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">TTML XML Lyrics (Optional for Synced Lyrics)</label>
              <textarea
                value={lyricsTtml}
                onChange={(e) => setLyricsTtml(e.target.value)}
                placeholder='e.g. <tt xml:lang="en" ...>...</tt>'
                rows={8}
                className="w-full bg-neutral-950 border border-neutral-850 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-neutral-800 disabled:text-neutral-500 text-white py-4 rounded-xl font-bold uppercase tracking-wider text-sm transition-all hover:scale-[1.01] shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Uploading Track...</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Submit Track to TTMLLIB</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
