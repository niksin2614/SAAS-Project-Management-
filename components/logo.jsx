import React from "react";

export default function Logo({ size = "default", className = "" }) {
  const isLarge = size === "lg";

  return (
    <div
      className={`inline-flex items-center gap-2.5 sm:gap-3 font-black select-none group cursor-pointer shrink-0 ${className}`}
      aria-label="SYNCD Logo"
    >
      {/* Geometric Sync Icon Mark */}
      <div
        className={`relative flex items-center justify-center shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-slate-800/80 shadow-lg shadow-blue-500/10 group-hover:border-blue-500/40 group-hover:shadow-blue-500/20 transition-all duration-300 ${
          isLarge
            ? "w-12 h-12 sm:w-16 sm:h-16 p-2"
            : "w-8 h-8 sm:w-9 sm:h-9 p-1.5"
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="w-full h-full block shrink-0"
          style={{ width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" }}
        >
          <defs>
            <linearGradient id="logo-sync-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="logo-sync-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <path
            d="M7 16C7 11.029 11.029 7 16 7C19.5 7 22.5 9 24.2 12L20.6 13.8C19.5 11.8 17.8 10.8 16 10.8C13.128 10.8 10.8 13.128 10.8 16C10.8 17.2 11.2 18.3 12 19.2L8.9 21.6C7.7 20 7 18.1 7 16Z"
            fill="url(#logo-sync-1)"
          />
          <path
            d="M25 16C25 20.971 20.971 25 16 25C12.5 25 9.5 23 7.8 20L11.4 18.2C12.5 20.2 14.2 21.2 16 21.2C18.872 21.2 21.2 18.872 21.2 16C21.2 14.8 20.8 13.7 20 12.8L23.1 10.4C24.3 12 25 13.9 25 16Z"
            fill="url(#logo-sync-2)"
          />
          <circle cx="16" cy="16" r="2.5" fill="#38bdf8" />
        </svg>
      </div>

      {/* Modern Wordmark */}
      <span
        className={`tracking-wider font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 group-hover:from-white group-hover:to-blue-200 transition-all ${
          isLarge
            ? "text-4xl sm:text-6xl font-black tracking-widest"
            : "text-xl sm:text-2xl"
        }`}
      >
        SYNCD
      </span>
    </div>
  );
}

