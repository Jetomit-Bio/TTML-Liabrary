import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { Track } from "@/app/actions";
import { convertTtmlToLrc } from "@/lib/lrcHelper";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const trackName = searchParams.get("track_name");
  const artistName = searchParams.get("artist_name");
  const albumName = searchParams.get("album_name");

  if (!q && !trackName) {
    return NextResponse.json(
      {
        code: 400,
        name: "BadRequest",
        message: "At least one of the parameters 'q' or 'track_name' must be present."
      },
      { status: 400 }
    );
  }

  const pool = getDbPool();

  try {
    // 1. Query local database
    let querySql = `
      SELECT id, title, artist, album, duration, type, lyrics, distributor, duration_seconds, youtube_id, lyrics_ttml 
      FROM tracks 
      WHERE 1=1
    `;
    const queryParams: any[] = [];

    if (q) {
      querySql += ` AND (LOWER(title) LIKE ? OR LOWER(artist) LIKE ? OR LOWER(album) LIKE ?)`;
      const term = `%${q.trim().toLowerCase()}%`;
      queryParams.push(term, term, term);
    }

    if (trackName) {
      querySql += ` AND LOWER(title) LIKE ?`;
      queryParams.push(`%${trackName.trim().toLowerCase()}%`);
    }

    if (artistName) {
      querySql += ` AND LOWER(artist) LIKE ?`;
      queryParams.push(`%${artistName.trim().toLowerCase()}%`);
    }

    if (albumName) {
      querySql += ` AND LOWER(album) LIKE ?`;
      queryParams.push(`%${albumName.trim().toLowerCase()}%`);
    }

    querySql += ` LIMIT 20`;

    const [rows]: any = await pool.execute(querySql, queryParams);

    const formatTrackResult = (track: Track) => {
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

      return {
        id: track.id,
        trackName: track.title,
        artistName: track.artist,
        albumName: track.album,
        duration: track.duration_seconds || 0,
        instrumental: false,
        plainLyrics,
        syncedLyrics,
        lyricsTtml: track.lyrics_ttml || null
      };
    };

    if (rows.length > 0) {
      const results = rows.map(formatTrackResult);
      return NextResponse.json(results);
    }

    // 2. Query external LRCLIB Search API if no local results are found
    let externalUrl = "https://lrclib.net/api/search?";
    if (q) {
      externalUrl += `q=${encodeURIComponent(q)}`;
    } else if (trackName) {
      externalUrl += `track_name=${encodeURIComponent(trackName)}`;
    }

    if (artistName) {
      externalUrl += `&artist_name=${encodeURIComponent(artistName)}`;
    }
    if (albumName) {
      externalUrl += `&album_name=${encodeURIComponent(albumName)}`;
    }

    const externalResponse = await fetch(externalUrl, {
      method: "GET",
      headers: {
        "User-Agent": "TTMLLIB Proxy (https://ttmllib.xyz)"
      }
    });

    if (!externalResponse.ok) {
      return NextResponse.json([]);
    }

    const lrclibResults = await externalResponse.json();
    if (!Array.isArray(lrclibResults) || lrclibResults.length === 0) {
      return NextResponse.json([]);
    }

    // Return the external search results
    const results = lrclibResults.slice(0, 20).map((item: any) => ({
      id: item.id, // Return original external ID or map it
      trackName: item.trackName,
      artistName: item.artistName,
      albumName: item.albumName,
      duration: item.duration,
      instrumental: item.instrumental || false,
      plainLyrics: item.plainLyrics || "",
      syncedLyrics: item.syncedLyrics || "",
      lyricsTtml: null
    }));

    return NextResponse.json(results);

  } catch (error: any) {
    console.error("Error in GET /api/search:", error);
    return NextResponse.json(
      { code: 500, name: "InternalServerError", message: error.message },
      { status: 500 }
    );
  }
}
