'use client';

import React, { useEffect, useRef } from 'react';

// --- DÁTOVÉ TYPY ---
export interface WordData {
  text: string;
  startTime: number; // v sekundách (napr. 12.0)
  endTime: number;   // v sekundách (napr. 12.5)
}

export interface LineData {
  id: string | number;
  startTime: number;
  endTime: number;
  words: WordData[];
}

interface LyricsProps {
  lyrics: LineData[];
  currentTime: number; // aktuálny čas prehrávača v sekundách
  onSeek?: (time: number) => void;
}

// --- JEDNOTLIVÉ SLOVO ---
const Word = ({ word, currentTime }: { word: WordData; currentTime: number }) => {
  const { text, startTime, endTime } = word;
  
  // Výpočet, koľko percent slova už bolo zaspievaných
  let progress = 0;
  if (currentTime >= endTime) {
    progress = 100;
  } else if (currentTime >= startTime && currentTime < endTime) {
    const duration = endTime - startTime;
    const elapsed = currentTime - startTime;
    progress = (elapsed / duration) * 100;
  }

  return (
    <span className="relative inline-block mr-[0.25em]">
      {/* Spodná vrstva: Stlmený text (budúcnosť) */}
      <span className="text-white/30">{text}</span>
      
      {/* Vrchná vrstva: Zvýraznený text, ktorý sa plynule odkrýva (minulosť/prítomnosť) */}
      <span
        className="absolute left-0 top-0 text-white overflow-hidden whitespace-nowrap will-change-[width]"
        style={{ width: `${progress}%` }}
      >
        {text}
      </span>
    </span>
  );
};

// --- HLAVNÁ KOMPONENTA PRE TEXTY ---
export default function Lyrics({ lyrics, currentTime, onSeek }: LyricsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Zabezpečenie plynulého scrollovania na aktuálny riadok
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full max-h-[600px] overflow-y-auto no-scrollbar px-4 sm:px-6 py-10 sm:py-16 md:py-20 flex flex-col gap-6 sm:gap-8"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {lyrics.map((line) => {
        // Riadok je aktívny, ak sme v jeho časovom okne (alebo ak prehrávač beží a už sme za jeho začiatkom, kým nezačne ďalší)
        const isActive = currentTime >= line.startTime && currentTime < line.endTime;
        const isPast = currentTime >= line.endTime;

        return (
          <div
            key={line.id}
            ref={isActive ? activeLineRef : null}
            onClick={() => onSeek && onSeek(line.startTime)}
            className={`cursor-pointer transition-all duration-300 ease-out transform origin-left hover:opacity-90 hover:scale-[1.01] ${
              isActive 
                ? 'scale-105 opacity-100 blur-none' 
                : 'scale-100 opacity-40 blur-[1px]' // Apple Music efekt rozmazania neaktívnych riadkov
            }`}
          >
            <p className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {line.words.map((word, index) => (
                <Word key={index} word={word} currentTime={currentTime} />
              ))}
            </p>
          </div>
        );
      })}
    </div>
  );
}
