import { LineData, WordData } from "@/components/Lyrics";

// Helper to convert time strings (like "00:00:12.500", "12.5s", or "12.5") to seconds (number)
function parseTimeToSeconds(timeStr: string | null | undefined): number {
  if (!timeStr) return 0;
  
  const cleanStr = timeStr.trim().replace(/s$/, ""); // Remove 's' suffix if any
  
  // Format: hh:mm:ss.xxx or mm:ss.xxx
  if (cleanStr.includes(":")) {
    const parts = cleanStr.split(":");
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    
    if (parts.length === 3) {
      hours = parseFloat(parts[0]);
      minutes = parseFloat(parts[1]);
      seconds = parseFloat(parts[2]);
    } else if (parts.length === 2) {
      minutes = parseFloat(parts[0]);
      seconds = parseFloat(parts[1]);
    }
    
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  // Format: ss.xxx
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
}

export function parseTtml(ttmlContent: string | null | undefined, plainContent: string | null | undefined): LineData[] {
  const lines: LineData[] = [];
  
  // 1. Try parsing TTML if present
  if (ttmlContent && ttmlContent.trim().startsWith("<")) {
    try {
      // Regex parsing for robustness against incomplete or custom XML tags
      // Find all <p> elements
      const pRegex = /<p\b([^>]*?)>([\s\S]*?)<\/p>/gi;
      let pMatch;
      let lineId = 1;
      
      while ((pMatch = pRegex.exec(ttmlContent)) !== null) {
        const attributes = pMatch[1];
        const innerContent = pMatch[2];
        
        // Extract begin and end attributes from <p>
        const beginMatch = /\bbegin="([^"]+)"/i.exec(attributes);
        const endMatch = /\bend="([^"]+)"/i.exec(attributes);
        
        const lineStart = parseTimeToSeconds(beginMatch ? beginMatch[1] : null);
        const lineEnd = parseTimeToSeconds(endMatch ? endMatch[1] : null);
        
        const words: WordData[] = [];
        
        // Find all <span> elements inside this <p>
        const spanRegex = /<span\b([^>]*?)>([^<]*?)<\/span>/gi;
        let spanMatch;
        let hasSpans = false;
        
        while ((spanMatch = spanRegex.exec(innerContent)) !== null) {
          hasSpans = true;
          const spanAttrs = spanMatch[1];
          const text = spanMatch[2].trim();
          
          const sBeginMatch = /\bbegin="([^"]+)"/i.exec(spanAttrs);
          const sEndMatch = /\bend="([^"]+)"/i.exec(spanAttrs);
          
          const wordStart = sBeginMatch 
            ? parseTimeToSeconds(sBeginMatch[1]) 
            : lineStart;
          const wordEnd = sEndMatch 
            ? parseTimeToSeconds(sEndMatch[1]) 
            : lineEnd;
            
          if (text) {
            words.push({
              text,
              startTime: wordStart,
              endTime: wordEnd
            });
          }
        }
        
        // If there were no <span> elements inside, split the <p> text into words
        if (!hasSpans) {
          // Remove any tags inside the <p> text
          const plainText = innerContent.replace(/<[^>]*>/g, "").trim();
          if (plainText) {
            const rawWords = plainText.split(/\s+/);
            const duration = lineEnd - lineStart;
            const wordDuration = rawWords.length > 0 ? duration / rawWords.length : 0;
            
            rawWords.forEach((word, index) => {
              words.push({
                text: word,
                startTime: lineStart + index * wordDuration,
                endTime: lineStart + (index + 1) * wordDuration
              });
            });
          }
        }
        
        if (words.length > 0) {
          lines.push({
            id: lineId++,
            startTime: lineStart,
            endTime: lineEnd || (lineStart + 5), // default to 5s if end time not provided
            words
          });
        }
      }
      
      if (lines.length > 0) {
        return lines;
      }
    } catch (e) {
      console.error("Error regex-parsing TTML:", e);
    }
  }

  // 2. Fallback to Plain Content (Split by line, distribute time synthetically)
  const textSource = plainContent || "";
  const rawLines = textSource
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);
    
  let currentStart = 0;
  const lineDuration = 4; // 4 seconds per line
  const parsedLines: LineData[] = [];
  let lineIdCount = 1;

  for (const lineText of rawLines) {
    // Strip LRC timestamps like [00:10.00], [00:10], or double [00:10.00][00:10.00]
    const cleanLineText = lineText.replace(/(?:\[\d{2,}:\d{2}(?:\.\d{2,3})?\])+/g, "").trim();
    if (!cleanLineText) continue;

    const rawWords = cleanLineText.split(/\s+/);
    const wordDuration = lineDuration / rawWords.length;
    
    const words = rawWords.map((word, wIdx) => ({
      text: word,
      startTime: currentStart + wIdx * wordDuration,
      endTime: currentStart + (wIdx + 1) * wordDuration
    }));
    
    parsedLines.push({
      id: `plain-${lineIdCount++}`,
      startTime: currentStart,
      endTime: currentStart + lineDuration,
      words
    });
    
    currentStart += lineDuration;
  }

  return parsedLines;
}
