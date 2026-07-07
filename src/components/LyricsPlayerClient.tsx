"use client";

import React, { useState, useEffect, useRef } from "react";
import Lyrics, { LineData } from "@/components/Lyrics";
import { Track } from "@/app/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LyricsPlayerClientProps {
  track: Track;
  lyrics: LineData[];
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export default function LyricsPlayerClient({ track, lyrics }: LyricsPlayerClientProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration_seconds || 240);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<any>(null);

  // Set isClient to true on mount to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load YouTube Iframe API and bind to the existing iframe
  useEffect(() => {
    if (!isClient || !track.youtube_id) return;

    // Load YouTube API script if not loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    let intervalId: NodeJS.Timeout;
    let playerInstance: any;

    const bindPlayer = () => {
      try {
        playerInstance = new window.YT.Player("youtube-player", {
          events: {
            onReady: () => {
              if (playerInstance && typeof playerInstance.getDuration === "function") {
                const dur = playerInstance.getDuration();
                if (dur > 0) setDuration(dur);
              }
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                if (playerInstance && typeof playerInstance.getDuration === "function") {
                  const dur = playerInstance.getDuration();
                  if (dur > 0) setDuration(dur);
                }
                intervalId = setInterval(() => {
                  if (playerInstance && typeof playerInstance.getCurrentTime === "function") {
                    setCurrentTime(playerInstance.getCurrentTime());
                  }
                }, 50);
              } else {
                setIsPlaying(false);
                clearInterval(intervalId);
                // Capture the exact seek position when paused or stopped
                if (playerInstance && typeof playerInstance.getCurrentTime === "function") {
                  setCurrentTime(playerInstance.getCurrentTime());
                }
              }
            },
          },
        });
        playerRef.current = playerInstance;
      } catch (err) {
        console.error("Error binding YouTube player:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      bindPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        bindPlayer();
      };
    }

    return () => {
      clearInterval(intervalId);
      if (playerInstance && typeof playerInstance.destroy === "function") {
        try {
          playerInstance.destroy();
        } catch (e) {}
      }
    };
  }, [isClient, track.youtube_id]);

  // Simulation player fallback (only active when no YouTube ID is present)
  useEffect(() => {
    if (track.youtube_id) return;

    if (isPlaying) {
      const start = Date.now() - currentTime * 1000;
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - start) / 1000;
        if (elapsed >= duration) {
          setCurrentTime(duration);
          setIsPlaying(false);
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setCurrentTime(elapsed);
        }
      }, 30);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, track.youtube_id, duration, currentTime]);

  const handlePlayPause = () => {
    if (track.youtube_id && playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    
    if (track.youtube_id && playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(val, true);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    
    if (track.youtube_id && playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(time, true);
    }
  };

  const handleCopy = () => {
    if (!track.lyrics_ttml) return;
    navigator.clipboard.writeText(track.lyrics_ttml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!track.lyrics_ttml) return;
    const blob = new Blob([track.lyrics_ttml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${track.title.replace(/\s+/g, "_")}.ttml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to format time (MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-screen flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold mb-8 transition-all text-xs tracking-wider uppercase hover:scale-105 origin-left cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        BACK
      </button>

      {/* Grid Layout: Left Metadata & Video Player, Right Synced Lyrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-stretch flex-grow">
        
        {/* Left Column: Metadata & Audio/Video Control */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-5 sm:p-6 md:p-8 rounded-2xl">
          
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <span className="bg-indigo-950/80 border border-indigo-900/50 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {track.type} Lyrics
              </span>
              <h1 className="text-4xl font-black text-white mt-4 tracking-tight leading-tight flex items-center gap-2 flex-wrap">
                <span>{track.title}</span>
                {track.is_verified === 1 && (
                  <span className="w-6 h-6 shrink-0 inline-block" title="Verified Track">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false" aria-hidden="true" style={{ pointerEvents: 'none', display: 'inherit', width: '100%', height: '100%' }}>
                      <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Z" fill="white" />
                      <path d="M17.707 8.293a1 1 0 010 1.414L10 17.414l-3.707-3.707a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0Z" fill="black" />
                    </svg>
                  </span>
                )}
              </h1>
              <p className="text-xl text-neutral-300 font-semibold mt-1">{track.artist}</p>
              {track.album && <p className="text-neutral-500 font-medium mt-0.5">Album: {track.album}</p>}
            </div>

            {/* Additional Metadata Details */}
            <div className="border-t border-neutral-800/80 pt-6 space-y-3 text-sm text-neutral-400">
              {track.distributor && (
                <div className="flex justify-between">
                  <span>Distributor:</span>
                  <Link
                    href={`/distributor/${encodeURIComponent(track.distributor)}`}
                    className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {track.distributor}
                  </Link>
                </div>
              )}
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-semibold text-neutral-200">{track.duration}</span>
              </div>
            </div>

            {/* Copy / Download TTML Actions */}
            {track.lyrics_ttml && (
              <div className="border-t border-neutral-800/80 pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleCopy}
                  className="w-full sm:flex-1 inline-flex items-center justify-center bg-neutral-950/60 hover:bg-neutral-900 border border-neutral-850 text-neutral-300 hover:text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-indigo-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy TTML
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full sm:flex-1 inline-flex items-center justify-center bg-indigo-650 hover:bg-indigo-600 active:bg-indigo-750 text-white py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md shadow-indigo-650/15 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download TTML
                </button>
              </div>
            )}
          </div>

          {/* Player Panel */}
          <div className="space-y-6">
            {isClient && track.youtube_id ? (
              /* YouTube Video Player (rendered directly in the UI) */
              <div className="w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-black/60 shadow-xl">
                <iframe
                  id="youtube-player"
                  src={`https://www.youtube.com/embed/${track.youtube_id}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&playsinline=1&controls=1&rel=0&modestbranding=1`}
                  width="100%"
                  height="100%"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              /* Fallback Simulated Player Controls (for tracks without YouTube ID) */
              <div className="bg-neutral-950/60 border border-neutral-800/50 rounded-xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePlayPause}
                    className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-full p-4 hover:scale-105 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  <div className="text-right">
                    <span className="text-sm font-mono text-neutral-400">{formatTime(currentTime)}</span>
                    <span className="text-sm font-mono text-neutral-600 mx-1">/</span>
                    <span className="text-sm font-mono text-neutral-500">{formatTime(duration)}</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.05"
                  value={currentTime}
                  onChange={handleSliderChange}
                  className="w-full h-1.5 bg-neutral-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Synced Lyrics Component */}
        <div className="lg:col-span-7 flex flex-col justify-center bg-neutral-900/20 border border-neutral-800/80 rounded-2xl shadow-xl overflow-hidden min-h-[350px] sm:min-h-[450px] lg:min-h-[500px]">
          <Lyrics lyrics={lyrics} currentTime={currentTime} onSeek={handleSeek} />
        </div>
      </div>
    </div>
  );
}
