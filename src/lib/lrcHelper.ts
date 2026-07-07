/**
 * Converts a TTML XML string back to the standard LRC synced format (e.g., [00:17.52] lyrics)
 */
export function convertTtmlToLrc(ttml: string | null | undefined): string {
  if (!ttml) return "";
  
  try {
    // Extract all <p begin="..." end="...">...</p>
    const pRegex = /<p\s+[^>]*begin="([^"]+)"[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    let lrc = "";
    
    while ((match = pRegex.exec(ttml)) !== null) {
      const begin = match[1]; // e.g. "00:00:17.524", "00:17.524", or "17.524"
      const content = match[2].replace(/<[^>]*>/g, "").trim(); // strip span tags
      
      // Parse begin time string to seconds
      const parts = begin.split(':');
      let secs = 0;
      if (parts.length === 3) {
        secs = parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
      } else if (parts.length === 2) {
        secs = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
      } else {
        secs = parseFloat(parts[0]) || 0;
      }
      
      // Format seconds as MM:SS.xx
      const mins = Math.floor(secs / 60);
      const remainingSecs = (secs % 60).toFixed(2);
      const formattedTime = `${mins.toString().padStart(2, '0')}:${remainingSecs.padStart(5, '0')}`;
      
      lrc += `[${formattedTime}] ${content}\n`;
    }
    return lrc.trim();
  } catch (error) {
    console.error("Error converting TTML to LRC:", error);
    return "";
  }
}

/**
 * Format duration seconds to standard MM:SS string
 */
export function formatDurationString(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
