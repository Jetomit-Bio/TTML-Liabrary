import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { Track } from "@/app/actions";
import { convertTtmlToLrc } from "@/lib/lrcHelper";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const trackId = parseInt(id, 10);

  if (isNaN(trackId)) {
    return NextResponse.json(
      {
        code: 400,
        name: "BadRequest",
        message: "Invalid track ID format. ID must be a number."
      },
      { status: 400 }
    );
  }

  try {
    const pool = getDbPool();
    const [rows]: any = await pool.execute(
      `SELECT id, title, artist, album, duration, type, lyrics, distributor, duration_seconds, youtube_id, lyrics_ttml, is_verified 
       FROM tracks WHERE id = ?`,
      [trackId]
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
      duration: track.duration_seconds || 0,
      instrumental: false,
      plainLyrics,
      syncedLyrics,
      lyricsTtml: track.lyrics_ttml || null,
      isVerified: track.is_verified === 1,
      distributor: track.distributor || null
    });
  } catch (error: any) {
    console.error(`Database error in /api/get/${id}:`, error);
    return NextResponse.json(
      { code: 500, name: "InternalServerError", message: error.message },
      { status: 500 }
    );
  }
}
