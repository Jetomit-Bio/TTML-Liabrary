import { notFound } from "next/navigation";
import { getDbPool } from "@/lib/db";
import { Track } from "@/app/actions";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ name: string }>;
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  return {
    title: `${decodedName} - Distributor | TTMLLIB`,
    description: `View all lyrics uploaded by distributor ${decodedName} on TTMLLIB.`,
  };
}

export default async function DistributorPage({ params }: PageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const pool = getDbPool();
  let tracks: Track[] = [];
  let distributorSince: Date | null = null;

  try {
    // 1. Fetch tracks uploaded by this distributor
    const [rows] = await pool.execute<Track[]>(
      `SELECT id, title, artist, album, duration, type, created_at, is_verified 
       FROM tracks 
       WHERE distributor = ? 
       ORDER BY is_verified DESC, created_at DESC`,
      [decodedName]
    );
    tracks = rows;

    // 2. Fetch distributor since date from api_keys first
    const [apiKeyRows]: any = await pool.execute(
      "SELECT created_at FROM api_keys WHERE owner = ? LIMIT 1",
      [decodedName]
    );

    if (apiKeyRows.length > 0) {
      distributorSince = apiKeyRows[0].created_at;
    }

    // 3. Fallback to oldest track upload if api key created_at not found
    if (!distributorSince) {
      const [trackRows]: any = await pool.execute(
        "SELECT MIN(created_at) as first_upload FROM tracks WHERE distributor = ?",
        [decodedName]
      );
      if (trackRows.length > 0 && trackRows[0].first_upload) {
        distributorSince = trackRows[0].first_upload;
      }
    }
  } catch (error) {
    console.error("Database fetch error for distributor:", error);
  }

  // If no tracks are found and we don't have a "since" date, they don't exist as a distributor in our db
  if (tracks.length === 0 && !distributorSince) {
    notFound();
  }

  // Format date
  let formattedDate = "Unknown";
  if (distributorSince) {
    const d = new Date(distributorSince);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    formattedDate = `${day}.${month}.${year}`;
  }

  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans antialiased min-h-screen relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-screen transition-all duration-300 animate-fade-in">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold mb-8 transition-all text-xs tracking-wider uppercase hover:scale-105 origin-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          BACK TO HOME
        </Link>

        {/* Distributor Info Panel */}
        <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-5 sm:p-8 rounded-2xl mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="bg-indigo-950/80 border border-indigo-900/50 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Lyrics Distributor
              </span>
              <h1 className="text-4xl font-black text-white mt-4 tracking-tight leading-tight">
                {decodedName}
              </h1>
              <p className="text-neutral-400 text-sm mt-2">
                Distributor since <span className="font-semibold text-neutral-250">{formattedDate}</span>
              </p>
            </div>
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl px-5 py-4 text-center shrink-0">
              <span className="block text-3xl font-black text-indigo-400">{tracks.length}</span>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Submitted Lyrics</span>
            </div>
          </div>
        </div>

        {/* Tracks List */}
        <h2 className="text-xl text-neutral-400 mb-8 border-b border-neutral-800 pb-4">
          All Lyrics from <span className="text-white font-bold">{decodedName}</span>
        </h2>

        <div className="space-y-4 max-w-3xl">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <Link
                key={track.id}
                href={`/lyrics/${track.id}`}
                className="bg-neutral-900/60 backdrop-blur-sm border border-neutral-800/80 rounded-xl p-5 flex justify-between items-center hover:bg-neutral-800/50 hover:border-neutral-700 transition-all duration-250 cursor-pointer shadow-md group block"
              >
                <div className="flex-grow">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <span>{track.title}</span>
                    {track.is_verified === 1 && (
                      <span className="w-5 h-5 shrink-0 inline-block" title="Verified Track">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true" style={{ pointerEvents: 'none', display: 'inherit', width: '100%', height: '100%' }}>
                          <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Z" fill="white" />
                          <path d="M17.707 8.293a1 1 0 010 1.414L10 17.414l-3.707-3.707a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0Z" fill="black" />
                        </svg>
                      </span>
                    )}
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
              <p className="text-neutral-400 font-semibold text-lg mb-1">No tracks uploaded</p>
              <p className="text-neutral-500 text-sm">This distributor hasn't uploaded any lyrics yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
