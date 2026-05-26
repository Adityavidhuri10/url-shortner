import React from "react";
import UrlForm from "../components/UrlForm";

const LandingPage = ({ setView }) => {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col relative font-sans">
      {/* Clean Modern Navbar */}
      <header className="w-full bg-white border-b border-zinc-200/80 px-6 py-4 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-zinc-900 rounded-lg text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.0" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </div>
            <span className="font-bold text-zinc-900 text-base tracking-tight">
              snapUrl
            </span>
          </div>

          {/* Navigation CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("auth")}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white rounded-xl text-xs font-semibold tracking-wide transition duration-150 ease-in-out cursor-pointer shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Landing Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10 max-w-lg">
          <span className="px-2.5 py-1 text-[10px] font-semibold text-zinc-500 bg-zinc-100 rounded-full uppercase tracking-wider">
            Free Stateless Shortener
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight mt-4 leading-tight">
            Make your links concise.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-3 font-medium leading-relaxed">
            A simple, stateless, and high-performance URL shortener. Shorten links anonymously or create an account for advanced control.
          </p>
        </div>

        <div className="w-full max-w-lg bg-white border border-zinc-200/80 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <div className="text-center mb-6">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Shorten URL
            </h2>
            <p className="text-[11px] text-zinc-400 mt-1 font-medium">
              Paste your long link below to shrink it instantly.
            </p>
          </div>

          {/* Render the url form (guest view will automatically handle unauth flow) */}
          <UrlForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-200/60 text-center text-xs text-zinc-400">
        <p>&copy; {new Date().getFullYear()} snapUrl — Stateless link redirection.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
