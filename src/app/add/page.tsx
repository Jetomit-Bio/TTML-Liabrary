"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AddPage() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@jetomit.bio");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans antialiased min-h-screen relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold mb-10 transition-all text-xs tracking-wider uppercase hover:scale-105 origin-left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          BACK TO SEARCH
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-16">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Our Distributors</h1>
          <p className="text-neutral-455 text-base max-w-2xl leading-relaxed">
            TTMLLIB is open to verified lyrics distributors. Select one of our authorized distributors below to upload, sync, and submit your lyrics to the database.
          </p>
        </div>

        {/* Distributors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* SudoAPP Card */}
          <a
            href="https://sudoapp.pro"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-between text-center bg-neutral-900/30 hover:bg-neutral-900/60 backdrop-blur-md border border-neutral-900 hover:border-indigo-500/40 p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/10 hover:scale-[1.03] overflow-hidden"
          >
            {/* Hover card glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 group-hover:to-indigo-500/10 transition-all duration-300" />
            
            {/* Logo Container */}
            <div className="w-24 h-24 mb-6 flex items-center justify-center relative">
              <img
                src="/sudoapp.svg"
                alt="SudoAPP Logo"
                className="w-20 h-20 object-contain filter group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-300"
              />
            </div>

            {/* Details */}
            <div className="space-y-2 relative z-10">
              <h2 className="text-xl font-bold text-white tracking-wide group-hover:text-indigo-400 transition-colors">
                SudoAPP
              </h2>
              <p className="text-neutral-500 text-xs tracking-wider uppercase font-semibold">
                Official Distributor
              </p>
              <p className="text-neutral-400 text-sm mt-3 px-2 leading-relaxed">
                Connect and sync lyrics directly via YouTube streams with instant TTMLLIB database ingestion.
              </p>
            </div>

            {/* Action */}
            <div className="mt-8 text-indigo-400 group-hover:text-indigo-300 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5 transition-all">
              Go to SudoAPP
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>

        {/* Contact CTA */}
        <div className="mt-20 border-t border-neutral-900 pt-8 flex flex-col items-center text-center space-y-4">
          <p className="text-neutral-500 text-sm">Want to publish lyrics directly from your service?</p>
          <button
            onClick={() => setShowContactModal(true)}
            className="bg-neutral-900 hover:bg-neutral-850 active:bg-neutral-950 border border-neutral-800 hover:border-indigo-500/30 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all hover:scale-105 inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-black/35"
          >
            <span>Add distributor? Contact</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <div className="pt-2">
            <Link href="/terms/distributor" className="text-neutral-500 hover:text-white text-xs transition-colors underline">
              Distributor Terms of Service
            </Link>
          </div>
        </div>

      </div>

      {/* Contact Modal Popup */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-850 p-8 rounded-2xl shadow-2xl relative space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 mx-auto rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Become a Distributor</h2>
              <p className="text-neutral-400 text-sm">To request distributor API access for your app, reach out to our administration team.</p>
            </div>

            {/* Copyable Email Card */}
            <div className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Email Address</span>
                <a href="mailto:hello@jetomit.bio" className="block text-indigo-450 hover:text-indigo-300 font-mono text-base font-bold transition-colors">
                  hello@jetomit.bio
                </a>
              </div>
              <button
                onClick={handleCopyEmail}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="mailto:hello@jetomit.bio"
                className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-center text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all hover:scale-[1.02] shadow-lg shadow-indigo-600/15 flex items-center justify-center"
              >
                Send Email
              </a>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full sm:flex-1 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-neutral-350 hover:text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
