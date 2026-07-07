import { getDbPool } from "@/lib/db";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const pool = getDbPool();
    const [rows]: any = await pool.execute(
      "SELECT id, title, artist, album, type, lyrics FROM tracks ORDER BY id DESC"
    );

    let text = "TTMLLIB - Open TTML Lyrics Database by Jetomit-Bio\n";
    text += "==================================================\n\n";
    text += `Total tracks: ${rows.length}\n\n`;

    for (const track of rows) {
      text += `Track ID: ${track.id}\n`;
      text += `Title: ${track.title}\n`;
      text += `Artist: ${track.artist}\n`;
      text += `Album: ${track.album || "N/A"}\n`;
      text += `Type: ${track.type}\n`;
      text += `URL: https://ttmllib.xyz/lyrics/${track.id}\n`;
      text += `--- Lyrics ---\n`;
      text += `${track.lyrics || ""}\n`;
      text += `==================================================\n\n`;
    }

    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error: any) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
