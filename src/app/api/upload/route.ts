import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

function extractYoutubeId(val: any): string | null {
  if (!val || typeof val !== "string") return null;
  const trimmed = val.trim();
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes(".")) {
    return trimmed;
  }
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regex);
  return match ? match[1] : trimmed;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate API Key via x-api-key header
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "Missing x-api-key header" }, { status: 401, headers: corsHeaders });
    }

    const pool = getDbPool();
    const [keys] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM api_keys WHERE api_key = ?",
      [apiKey]
    );

    if (keys.length === 0) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401, headers: corsHeaders });
    }

    // 2. Parse request body
    const body = await req.json();
    const {
      distributor,
      title,
      album,
      artist,
      duration_seconds,
      youtube_id,
      lyrics_plain,
      lyrics_ttml,
    } = body;

    // 3. Validate required fields
    if (!distributor || typeof distributor !== "string" || distributor.trim() === "") {
      return NextResponse.json({ error: "Missing or invalid 'distributor'" }, { status: 400, headers: corsHeaders });
    }
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "Missing or invalid 'title' (song name)" }, { status: 400, headers: corsHeaders });
    }
    if (!artist || typeof artist !== "string" || artist.trim() === "") {
      return NextResponse.json({ error: "Missing or invalid 'artist' (author/artist name)" }, { status: 400, headers: corsHeaders });
    }
    if (typeof duration_seconds !== "number" || duration_seconds <= 0) {
      return NextResponse.json({ error: "Missing or invalid 'duration_seconds' (must be a positive number)" }, { status: 400, headers: corsHeaders });
    }
    if (!lyrics_plain || typeof lyrics_plain !== "string" || lyrics_plain.trim() === "") {
      return NextResponse.json({ error: "Missing or invalid 'lyrics_plain'" }, { status: 400, headers: corsHeaders });
    }

    // 4. Calculate formatted duration (MM:SS) from duration_seconds
    const minutes = Math.floor(duration_seconds / 60);
    const seconds = duration_seconds % 60;
    const durationFormatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Determine type: if lyrics_ttml is provided, it is Synced, else Plain
    const hasTtml = lyrics_ttml && typeof lyrics_ttml === "string" && lyrics_ttml.trim() !== "";
    const trackType = hasTtml ? "Synced" : "Plain";
    const cleanYoutubeId = extractYoutubeId(youtube_id);

    // 5. Insert track into database
    const [result] = await pool.execute(
      `INSERT INTO tracks (title, artist, album, duration, type, lyrics, distributor, duration_seconds, youtube_id, lyrics_ttml) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        artist.trim(),
        album ? album.trim() : null,
        durationFormatted,
        trackType,
        lyrics_plain.trim(),
        distributor.trim(),
        duration_seconds,
        cleanYoutubeId,
        hasTtml ? lyrics_ttml.trim() : null,
      ]
    );

    const insertId = (result as any).insertId;

    return NextResponse.json(
      {
        message: "Track uploaded successfully",
        trackId: insertId,
        type: trackType,
        duration: durationFormatted,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
