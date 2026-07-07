import React from "react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans antialiased min-h-screen relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        
        {/* Navigation / Header */}
        <header className="flex justify-between items-center mb-12 border-b border-neutral-900 pb-6">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/ttmllogo.svg" alt="TTMLLIB Logo" className="w-10 h-10 object-contain transition-transform group-hover:scale-105" />
            <span className="text-xl font-black tracking-wider text-white">TTMLLIB <span className="text-indigo-500">API</span></span>
          </Link>
          <Link href="/" className="text-neutral-450 hover:text-white text-sm font-semibold transition-colors">
            Back to Search
          </Link>
        </header>

        {/* Documentation Content */}
        <main className="space-y-16">
          
          {/* Intro Section */}
          <section className="space-y-4">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">API Reference Documentation</h1>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Welcome to the TTMLLIB public API interface. Our API offers high-speed queries to access synchronized lyrics records, complete with word-level timings and standard LRC fallbacks.
            </p>
            <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4 text-sm text-indigo-300">
              <span className="font-bold text-indigo-400">Base URL:</span> <code className="font-mono">https://ttmllib.xyz</code>
            </div>
          </section>

          {/* Endpoint 1: GET /api/get */}
          <section className="space-y-4 border-t border-neutral-900 pt-10">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded font-bold uppercase">GET</span>
              <h2 className="text-2xl font-bold text-white font-mono">/api/get</h2>
            </div>
            <p className="text-neutral-400 leading-relaxed text-sm">
              Attempt to find the best match of lyrics for a track. You must provide the exact signature, including the track name, artist name, album name, and duration in seconds.
            </p>
            <p className="text-neutral-500 text-xs italic">
              Note: If the lyrics are not found in the local cache database, this API will query external upstream sources (LRCLIB), index the result in our database, and return the record.
            </p>

            {/* Query parameters table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse border border-neutral-900">
                <thead>
                  <tr className="bg-neutral-900 text-neutral-300 font-bold border-b border-neutral-800">
                    <th className="p-3">Field</th>
                    <th className="p-3">Required</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-neutral-400">
                  <tr>
                    <td className="p-3 font-semibold font-mono text-neutral-200">track_name</td>
                    <td className="p-3 text-red-400">true</td>
                    <td className="p-3">string</td>
                    <td className="p-3">Title of the track</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-neutral-200">artist_name</td>
                    <td className="p-3 text-red-400">true</td>
                    <td className="p-3">string</td>
                    <td className="p-3">Name of the artist</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-neutral-200">album_name</td>
                    <td className="p-3 text-red-400">true</td>
                    <td className="p-3">string</td>
                    <td className="p-3">Name of the album</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-neutral-200">duration</td>
                    <td className="p-3 text-red-400">true</td>
                    <td className="p-3">number</td>
                    <td className="p-3">Track's duration in seconds (accepts ±2s variance)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Response Example */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Example Response</h3>
              <pre className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
{`200 OK:
{
  "id": 1,
  "trackName": "Cigarety",
  "artistName": "Sara Rikas, Matej Turcer",
  "albumName": "Ja, Sára",
  "duration": 222,
  "instrumental": false,
  "plainLyrics": "Cigarety a milión slov\\nAh, my favorite show...",
  "syncedLyrics": "[00:17.52] Cigarety a milión slov\\n[00:21.90] a\\n[00:22.12] milión...",
  "lyricsTtml": "<tt>...</tt>"
}`}
              </pre>
            </div>
          </section>

          {/* Endpoint 2: GET /api/get-cached */}
          <section className="space-y-4 border-t border-neutral-900 pt-10">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded font-bold uppercase">GET</span>
              <h2 className="text-2xl font-bold text-white font-mono">/api/get-cached</h2>
            </div>
            <p className="text-neutral-400 leading-relaxed text-sm">
              Identical parameter rules to <code className="font-mono text-indigo-400">/api/get</code>, except that it will ONLY query the internal TTMLLIB database cache. It will never run external network queries.
            </p>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Example Request</h3>
              <code className="block bg-neutral-950 border border-neutral-900 rounded-lg p-3 font-mono text-xs text-neutral-300">
                GET /api/get-cached?track_name=Cigarety&artist_name=Sara+Rikas%2C+Matej+Turcer&album_name=Ja%2C+S%C3%A1ra&duration=222
              </code>
            </div>
          </section>

          {/* Endpoint 3: GET /api/get/[id] */}
          <section className="space-y-4 border-t border-neutral-900 pt-10">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded font-bold uppercase">GET</span>
              <h2 className="text-2xl font-bold text-white font-mono">/api/get/[id]</h2>
            </div>
            <p className="text-neutral-400 leading-relaxed text-sm">
              Retrieve a specific lyrics record using its unique database ID.
            </p>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Example Request</h3>
              <code className="block bg-neutral-950 border border-neutral-900 rounded-lg p-3 font-mono text-xs text-neutral-300">
                GET /api/get/1
              </code>
            </div>
          </section>

          {/* Endpoint 4: GET /api/search */}
          <section className="space-y-4 border-t border-neutral-900 pt-10">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded font-bold uppercase">GET</span>
              <h2 className="text-2xl font-bold text-white font-mono">/api/search</h2>
            </div>
            <p className="text-neutral-400 leading-relaxed text-sm">
              Search for lyrics records using keywords. Returns an array of up to 20 matching results.
            </p>
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-3 text-xs text-neutral-400">
              <span className="font-bold text-neutral-300">Requirement:</span> At least one of the parameters <code className="font-mono text-indigo-400">q</code> or <code className="font-mono text-indigo-400">track_name</code> must be provided.
            </div>

            {/* Query parameters table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse border border-neutral-900">
                <thead>
                  <tr className="bg-neutral-900 text-neutral-300 font-bold border-b border-neutral-800">
                    <th className="p-3">Field</th>
                    <th className="p-3">Required</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-neutral-400">
                  <tr>
                    <td className="p-3 font-semibold font-mono text-neutral-200">q</td>
                    <td className="p-3 text-amber-400">conditional</td>
                    <td className="p-3">string</td>
                    <td className="p-3">Keyword matching title, artist name, or album name</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-neutral-200">track_name</td>
                    <td className="p-3 text-amber-400">conditional</td>
                    <td className="p-3">string</td>
                    <td className="p-3">Search for keywords inside the track title</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-neutral-200">artist_name</td>
                    <td className="p-3 text-neutral-500">false</td>
                    <td className="p-3">string</td>
                    <td className="p-3">Filter results by artist name</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-neutral-200">album_name</td>
                    <td className="p-3 text-neutral-500">false</td>
                    <td className="p-3">string</td>
                    <td className="p-3">Filter results by album name</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Response Example */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider">Example Response</h3>
              <pre className="bg-neutral-950 border border-neutral-900 rounded-xl p-4 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
{`200 OK:
[
  {
    "id": 1,
    "trackName": "Cigarety",
    "artistName": "Sara Rikas, Matej Turcer",
    "albumName": "Ja, Sára",
    "duration": 222,
    "instrumental": false,
    "plainLyrics": "Cigarety a milión slov...",
    "syncedLyrics": "[00:17.52] Cigarety a milión slov...",
    "lyricsTtml": "<tt>...</tt>"
  }
]`}
              </pre>
            </div>
          </section>

        </main>

        <footer className="mt-20 border-t border-neutral-900 pt-6 text-center text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} TTMLLIB. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
