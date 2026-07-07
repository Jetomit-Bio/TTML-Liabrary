import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { Track } from "@/app/actions";
import { convertTtmlToLrc, formatDurationString } from "@/lib/lrcHelper";

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

  const pool = getDbPool();

  try {
    // 1. Try local lookup first
    const [rows]: any = await pool.execute(
      `SELECT id, title, artist, album, duration, type, lyrics, distributor, duration_seconds, youtube_id, lyrics_ttml 
       FROM tracks 
       WHERE LOWER(title) = LOWER(?) 
         AND LOWER(artist) = LOWER(?) 
         AND LOWER(album) = LOWER(?)
         AND ABS(duration_seconds - ?) <= 2
       LIMIT 1`,
      [trackName.trim(), artistName.trim(), albumName.trim(), duration]
    );

    if (rows.length > 0) {
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
        duration: track.duration_seconds || duration,
        instrumental: false,
        plainLyrics,
        syncedLyrics,
        lyricsTtml: track.lyrics_ttml || null
      });
    }

    // 2. Query external LRCLIB API since it is not cached
    const externalUrl = `https://lrclib.net/api/get?track_name=${encodeURIComponent(trackName)}&artist_name=${encodeURIComponent(artistName)}&album_name=${encodeURIComponent(albumName)}&duration=${duration}`;
    
    const externalResponse = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "User-Agent": "TTMLLIB Proxy (https://ttmllib.xyz)"
      }
    });

    if (!externalResponse.ok) {
      if (externalResponse.status === 404) {
        return NextResponse.json(
          {
            code: 404,
            name: "TrackNotFound",
            message: "Failed to find specified track"
          },
          { status: 404 }
        );
      }
      throw new Error(`External API responded with status ${externalResponse.status}`);
    }

    const lrclibData = await externalResponse.json();

    // Cache the track locally in the database
    const type = lrclibData.syncedLyrics ? "Synced" : "Plain";
    const lyricsContent = lrclibData.syncedLyrics || lrclibData.plainLyrics || "";
    const durationFormatted = formatDurationString(lrclibData.duration || duration);

    const [insertResult]: any = await pool.execute(
      `INSERT INTO tracks (title, artist, album, duration, duration_seconds, type, lyrics)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        lrclibData.trackName || trackName,
        lrclibData.artistName || artistName,
        lrclibData.albumName || albumName,
        durationFormatted,
        lrclibData.duration || duration,
        type,
        lyricsContent
      ]
    );

    const newId = insertResult.insertId;

    return NextResponse.json({
      id: newId,
      trackName: lrclibData.trackName || trackName,
      artistName: lrclibData.artistName || artistName,
      albumName: lrclibData.albumName || albumName,
      duration: lrclibData.duration || duration,
      instrumental: lrclibData.instrumental || false,
      plainLyrics: lrclibData.plainLyrics || "",
      syncedLyrics: lrclibData.syncedLyrics || "",
      lyricsTtml: null // external cache has no native TTML
    });

  } catch (error: any) {
    console.error("Error in GET /api/get:", error);
    return NextResponse.json(
      { code: 500, name: "InternalServerError", message: error.message },
      { status: 500 }
    );
  }
}
