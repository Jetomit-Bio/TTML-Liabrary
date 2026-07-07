import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TTML Liabrary",
  description: "Terms of Service for TTML Liabrary (The Open TTML Lyrics Database).",
};

export default function TermsPage() {
  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans antialiased min-h-screen relative overflow-x-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        
        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-12 border-b border-neutral-900 pb-6 text-center sm:text-left">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/ttmllogo.svg" alt="TTMLLIB Logo" className="w-10 h-10 object-contain transition-transform group-hover:scale-105" />
            <span className="text-xl font-black tracking-wider text-white">TTML <span className="text-indigo-500">Liabrary</span></span>
          </Link>
          <div className="flex gap-4">
            <Link href="/terms/distributor" className="text-neutral-450 hover:text-white text-sm font-semibold transition-colors">
              Distributor Terms
            </Link>
            <span className="text-neutral-800">|</span>
            <Link href="/" className="text-neutral-450 hover:text-white text-sm font-semibold transition-colors">
              Back to Search
            </Link>
          </div>
        </header>

        {/* Terms Content */}
        <main className="space-y-8 bg-neutral-900/30 backdrop-blur-md border border-neutral-900 p-6 sm:p-10 rounded-2xl">
          <div className="border-b border-neutral-800 pb-6">
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Terms of Service for TTML Liabrary</h1>
            <p className="text-neutral-500 text-xs mt-2">Last Updated: July 2026</p>
          </div>

          <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
            Welcome to TTML Liabrary (The Open TTML Lyrics Database). These Terms of Service govern your access to and use of the TTML Liabrary website, our API, and the distributor portal used for content submission. By using our services, you agree to these terms.
          </p>

          <div className="space-y-6 text-neutral-400 text-sm leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">1. Basic Provisions</h2>
              <p>
                <strong>The Service:</strong> TTML Liabrary is a free, community-driven database providing access to Plain Text and synchronized (TTML XML) song lyrics.
              </p>
              <p>
                <strong>The User:</strong> Any individual or automated system (including bots and applications) that accesses the website or utilizes our API.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">2. Copyright & Content (DMCA)</h2>
              <p>
                <strong>Lyrics Ownership:</strong> TTML Liabrary does not claim any copyright ownership over the lyrics stored in the database. All rights to the music and lyrics belong to their original authors, performers, and publishers. The service is strictly for informational and educational purposes.
              </p>
              <p>
                <strong>Content Responsibility:</strong> Users who upload lyrics to the database are fully responsible for their accuracy and legality.
              </p>
              <p>
                <strong>Content Removal:</strong> We reserve the right to remove any content at any time, without prior notice, if it violates copyright laws or upon receiving a valid Takedown Notice from the rights holder.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">3. Content Submission & Distributor Portal</h2>
              <p>
                By using the portal to upload lyrics, you agree to provide the most accurate metadata possible (Song Title, Artist, Album, Duration).
              </p>
              <p>
                It is strictly prohibited to upload spam, malicious code, advertisements, or any other content unrelated to actual song lyrics.
              </p>
              <p>
                We reserve the right to revoke upload access for any user who repeatedly submits incorrect, duplicated, or corrupted TTML files.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">4. TTML Liabrary API Usage</h2>
              <p>
                <strong>Access:</strong> The API is provided for community developers to integrate lyrics into their own projects.
              </p>
              <p>
                <strong>Rate Limiting:</strong> To ensure database stability, the API is protected against abuse. The system monitors traffic and enforces strict rate limits. Exceeding these limits will result in a temporary ban.
              </p>
              <p>
                <strong>Commercial Use:</strong> Scraping or mass-downloading the entire database for the purpose of reselling the data is strictly prohibited without prior written agreement.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">5. Infrastructure Protection & Abuse Prevention</h2>
              <p>
                Any attempts to overload the servers (DDoS), breach the database, or bypass security measures will result in an immediate and permanent IP ban.
              </p>
              <p>
                The system logs basic technical data, specifically IP addresses, strictly to protect the infrastructure, manage API rate limits, and enforce the 2-hour interval for community voting. This ensures a fair environment and prevents abuse. This data is kept secure and is never shared with third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">6. Disclaimer of Warranties</h2>
              <p>
                <strong>No Guarantee:</strong> The TTML Liabrary service and its API are provided strictly on an &quot;AS IS&quot; basis. We do not guarantee 100% server uptime or absolute synchronization accuracy for the provided TTML files.
              </p>
              <p>
                <strong>Liability:</strong> We bear no responsibility for any downtime of your applications that rely on our API, nor for any direct or indirect damages arising from the use of this service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">7. Changes to the Terms</h2>
              <p>
                The operator reserves the right to modify these terms at any time. The updated version will always be published on this page.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-neutral-850">
              <h2 className="text-lg font-bold text-white">Contact</h2>
              <p>
                If you have questions regarding the API, wish to report a copyright infringement, or found a bug in the database, please contact us at{" "}
                <a href="mailto:system@ttmllib.xyz" className="text-indigo-400 hover:underline">
                  system@ttmllib.xyz
                </a>{" "}
                or join our Discord at{" "}
                <a href="https://discord.gg/BspED8JPEZ" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                  https://discord.gg/BspED8JPEZ
                </a>.
              </p>
            </section>
          </div>
        </main>

        <footer className="mt-20 border-t border-neutral-900 pt-6 text-center text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} TTML Liabrary. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
