import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Distributor Terms of Service | TTML Liabrary",
  description: "Distributor Terms of Service for TTML Liabrary contribution network.",
};

export default function DistributorTermsPage() {
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
            <Link href="/terms" className="text-neutral-450 hover:text-white text-sm font-semibold transition-colors">
              General Terms
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
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Distributor Terms of Service</h1>
            <p className="text-neutral-500 text-xs mt-2">Last Updated: July 2026</p>
          </div>

          <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
            Welcome to the TTML Liabrary contribution network. These Terms of Service apply to all authorized Distributors—individuals, developers, or automated systems—granted the privilege to upload, ingest, or manage track metadata and lyrics content within the TTML Liabrary database. By utilizing any TTML Liabrary ingestion pipeline, portal, or API endpoint, you agree to strictly abide by the following terms.
          </p>

          <div className="space-y-6 text-neutral-400 text-sm leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">1. Distributor Status & Account Security</h2>
              <p>
                <strong>Privilege, Not a Right:</strong> Distributor status is granted to trusted contributors to help grow the open database. TTML Liabrary reserves the right to suspend, limit, or permanently revoke your ingestion privileges at any time, without prior notice, if these terms are violated.
              </p>
              <p>
                <strong>Credential Security:</strong> If you are provided with distributor accounts, API keys, or authorization tokens, you are entirely responsible for their security. Sharing your ingestion credentials with unauthorized third parties is strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">2. Content Quality & Submission Standards</h2>
              <p>
                As a Distributor, you directly impact the reliability of the TTML Liabrary database. All submissions must meet strict quality controls:
              </p>
              <p>
                <strong>Accurate Metadata:</strong> You must provide precise and verified metadata for every ingested track, including the Song Title, Artist/Authors, Album, and exact Duration.
              </p>
              <p>
                <strong>Valid Formatting:</strong> When submitting synchronized lyrics (TTML XML), the code must be well-formed and valid (<code>&lt;tt xmlns=&#x27;http://www.w3.org/ns/ttml&#x27;&gt;...</code>). Broken, malformed, or intentionally obfuscated code is unacceptable and will result in rejected payloads.
              </p>
              <p>
                <strong>No Spam or Self-Promotion:</strong> The lyrics payload fields are exclusively for lyrics. Inserting promotional links, social media handles, shoutouts, or any non-lyric text into the Plain Text or TTML XML is strictly forbidden.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">3. Copyright & Intellectual Property</h2>
              <p>
                <strong>No Ownership Claims:</strong> Uploading lyrics to TTML Liabrary does not grant you any copyright ownership over the original musical works or the lyrics themselves.
              </p>
              <p>
                <strong>Right to Distribute:</strong> By ingesting content, you confirm that the lyrics are either your original work, you have the explicit authorization to distribute them, or they are being submitted under fair use for community and educational purposes.
              </p>
              <p>
                <strong>DMCA Compliance:</strong> You agree not to upload content that has been actively restricted by copyright holders. TTML Liabrary complies with digital copyright laws, and any content flagged by rights holders will be immediately purged.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">4. Technical Integrity & Abuse Prevention</h2>
              <p>
                <strong>System Integrity:</strong> You must not attempt to bypass ingestion limits, inject malicious payloads (e.g., SQL injection, cross-site scripting), or artificially inflate database metrics with fake or blank tracks.
              </p>
              <p>
                <strong>Rate Limits:</strong> If you utilize automated scripts or bots to feed the database, you must strictly respect all designated API rate limits. Spamming or overloading the ingestion endpoints will trigger automated firewall blocks to protect the infrastructure.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">5. Data Moderation & Purging</h2>
              <p>
                <strong>Right to Edit:</strong> TTML Liabrary administrators reserve the right to modify, correct, overwrite, or completely delete any track data you ingest if it is found to be inaccurate, duplicated, or of poor quality.
              </p>
              <p>
                <strong>No Guarantee of Retention:</strong> We do not guarantee that every track you ingest will remain permanently hosted in the database.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-white">6. Updates to the Terms</h2>
              <p>
                The TTML Liabrary administration reserves the right to modify these Distributor Terms at any time. Continued use of the ingestion pipelines following any changes constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-neutral-850">
              <h2 className="text-lg font-bold text-white">Distributor Support</h2>
              <p>
                If you experience issues with the ingestion endpoints, formatting errors, or need technical assistance with your TTML payloads, please contact the database administrator at{" "}
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
