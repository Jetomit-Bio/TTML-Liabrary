import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { Track } from "@/app/actions";
import { convertTtmlToLrc } from "@/lib/lrcHelper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackName = searchParams.get("track_name");
  const artistName = searchParams.get("artist_name");
  const albumName = searchParams.get("album_name");
  const durationParam = searchParams.get("duration");

  if (!trackName || !artistName || !albumName || !durationParam) {
    return NextResponse.json(
      {
        code: 400,
        name: "BadRequest",
        message: "Missing required query parameters: track_name, artist_name, album_name, duration"
      },
      { status: 400 }
    );
  }

  const duration = parseInt(durationParam, 10);
  if (isNaN(duration)) {
    return NextResponse.json(
      {
        code: 400,
        name: "BadRequest",
        message: "Invalid duration value. Must be a number."
      },
      { status: 400 }
    );
  }

  try {
    const pool = getDbPool();
    // Query database for case-insensitive match on track signature within +/- 2s duration
    const [rows]: any = await pool.execute(
      `SELECT id, title, artist, album, duration, type, lyrics, distributor, duration_seconds, youtube_id, lyrics_ttml, is_verified 
       FROM tracks 
       WHERE LOWER(title) = LOWER(?) 
         AND LOWER(artist) = LOWER(?) 
         AND LOWER(album) = LOWER(?)
         AND ABS(duration_seconds - ?) <= 2
       LIMIT 1`,
      [trackName.trim(), artistName.trim(), albumName.trim(), duration]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          code: 404,
          name: "TrackNotFound",
          message: "Failed to find specified track"
        },
        { status: 404 }
      );
    }

    const track = rows[0] as Track;

    let plainLyrics = "";
    let syncedLyrics = "";

    if (track.type === "Synced") {
      if (track.lyrics_ttml) {
        plainLyrics = track.lyrics || "";
        syncedLyrics = convertTtmlToLrc(track.lyrics_ttml);
      } else {
        // Fallback for LRC-saved formats
        syncedLyrics = track.lyrics || "";
        plainLyrics = (track.lyrics || "").replace(/(?:\[\d{2,}:\d{2}(?:\.\d{2,3})?\])+/g, "").trim();
      }
    } else {
      plainLyrics = track.lyrics || "";
    }

    return NextResponse.json({
      id: track.id,
      trackName: track.title,
      artistName: track.artist,
      albumName: track.album,
      duration: track.duration_seconds || duration,
      instrumental: false,
      plainLyrics,
      syncedLyrics,
      lyricsTtml: track.lyrics_ttml || null,
      isVerified: track.is_verified === 1,
      distributor: track.distributor || null
    });
  } catch (error: any) {
    console.error("Database error in /api/get-cached:", error);
    return NextResponse.json(
      { code: 500, name: "InternalServerError", message: error.message },
      { status: 500 }
    );
  }
}
