import { notFound } from "next/navigation";
import { getDbPool } from "@/lib/db";
import { Track } from "@/app/actions";
import { parseTtml } from "@/lib/ttmlParser";
import LyricsPlayerClient from "@/components/LyricsPlayerClient";
import type { Metadata } from "next";
import { searchSpotifyTrack } from "@/lib/spotify";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dynamic SEO metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trackId = parseInt(id, 10);
  if (isNaN(trackId)) {
    return { title: "Lyrics Not Found | TTMLLIB" };
  }

  const pool = getDbPool();
  try {
    const [rows] = await pool.execute<Track[]>(
      "SELECT title, artist FROM tracks WHERE id = ?",
      [trackId]
    );

    if (rows.length === 0) {
      return { title: "Lyrics Not Found | TTMLLIB" };
    }

    const track = rows[0];

    // Fetch Spotify cover image
    let imageUrl = "/ttmllogo.png";
    try {
      const spotifyTrack = await searchSpotifyTrack(track.title, track.artist);
      if (spotifyTrack?.album?.images?.length && spotifyTrack.album.images.length > 0) {
        imageUrl = spotifyTrack.album.images[0].url;
      }
    } catch (err) {
      console.error("Error fetching Spotify track image:", err);
    }

    return {
      title: `${track.title} - ${track.artist} | TTMLLIB`,
      description: `Complete synced and plain text lyrics for "${track.title}" by ${track.artist} on TTMLLIB (The Open TTML Lyrics Database).`,
      openGraph: {
        title: `${track.title} - ${track.artist} | TTMLLIB`,
        description: `Complete synced and plain text lyrics for "${track.title}" by ${track.artist} on TTMLLIB.`,
        type: "music.song",
        images: [
          {
            url: imageUrl,
            alt: `${track.title} cover art`,
          }
        ]
      },
      twitter: {
        card: "summary",
        title: `${track.title} - ${track.artist} | TTMLLIB`,
        description: `Complete synced and plain text lyrics for "${track.title}" by ${track.artist} on TTMLLIB.`,
        images: [imageUrl],
      }
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return { title: "TTMLLIB Lyrics Database" };
  }
}

export default async function LyricsPage({ params }: PageProps) {
  const { id } = await params;
  const trackId = parseInt(id, 10);
  if (isNaN(trackId)) {
    notFound();
  }

  const pool = getDbPool();
  let track: Track | null = null;

  try {
    const [rows] = await pool.execute<Track[]>(
      `SELECT id, title, artist, album, duration, type, lyrics, distributor, duration_seconds, youtube_id, lyrics_ttml, is_verified 
       FROM tracks WHERE id = ?`,
      [trackId]
    );

    if (rows.length > 0) {
      track = rows[0];
    }
  } catch (error) {
    console.error("Database fetch error for track:", error);
  }

  if (!track) {
    notFound();
  }

  // Parse lyrics using parser utility
  const parsedLyrics = parseTtml(track.lyrics_ttml, track.lyrics);

  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans antialiased min-h-screen relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <LyricsPlayerClient track={track} lyrics={parsedLyrics} />
    </div>
  );
}
