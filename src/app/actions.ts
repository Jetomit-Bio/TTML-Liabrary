"use server";

import { getDbPool } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export interface Track extends RowDataPacket {
  id: number;
  title: string;
  artist: string;
  album: string | null;
  duration: string;
  type: 'Plain' | 'Synced';
  lyrics: string | null;
  is_verified?: number;
}

export async function searchTracks(query: string): Promise<Track[]> {
  const trimmed = query ? query.trim() : "";
  if (trimmed === "") {
    return [];
  }
  
  const pool = getDbPool();
  try {
    // Search in title, artist, or album, ordering by verified status first
    const searchPattern = `%${trimmed}%`;
    const [rows] = await pool.execute<Track[]>(
      "SELECT id, title, artist, album, duration, type, lyrics, is_verified FROM tracks WHERE title LIKE ? OR artist LIKE ? OR album LIKE ? ORDER BY is_verified DESC",
      [searchPattern, searchPattern, searchPattern]
    );
    return rows;
  } catch (error) {
    console.error("Database search error:", error);
    return [];
  }
}
