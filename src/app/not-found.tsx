import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-neutral-950 text-neutral-100 font-sans antialiased min-h-screen relative overflow-x-hidden flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[350px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <main className="relative z-10 flex flex-col items-center justify-center p-6 w-full max-w-xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-98 duration-500">
        {/* Logo */}
        <div className="w-24 h-24 mb-2 flex items-center justify-center cursor-pointer">
          <Link href="/">
            <img
              src="/ttmllogo.svg"
              alt="TTMLLIB Logo"
              className="w-24 h-24 object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Status Code / Visual */}
        <div className="relative group">
          <h1 className="text-9xl font-black tracking-widest bg-gradient-to-b from-white via-neutral-200 to-indigo-950 bg-clip-text text-transparent select-none">
            404
          </h1>
          <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full scale-75 pointer-events-none" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-wide uppercase text-neutral-200">
            Page Not Found
          </h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto leading-relaxed">
            The lyrics page, track, or resource you are looking for does not exist, or has been moved to another location.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500/50 text-neutral-300 hover:text-white px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-indigo-500/5 hover:scale-[1.03] cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Homepage
          </Link>
        </div>

        {/* Footer links */}
        <div className="flex justify-center items-center gap-x-4 text-xs font-semibold tracking-wide uppercase text-neutral-600 pt-6 border-t border-neutral-900 w-full">
          <Link href="/docs" className="hover:text-neutral-400 transition-colors">API Docs</Link>
          <span>•</span>
          <Link href="/add" className="hover:text-neutral-400 transition-colors">Add Lyrics</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-neutral-400 transition-colors">Terms</Link>
        </div>
      </main>
    </div>
  );
}
