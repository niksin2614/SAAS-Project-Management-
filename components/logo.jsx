import React from "react";

export default function Logo({ size = "default", className = "" }) {
  const isLarge = size === "lg";

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-3 select-none group cursor-pointer ${className}`}
      aria-label="SYNCD Logo"
    >
      {/* Sleek Luminous Icon Mark */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-blue-950/80 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.2)] group-hover:border-blue-400/50 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] backdrop-blur-md transition-all duration-300 ${
          isLarge
            ? "w-14 h-14 sm:w-20 sm:h-20 p-2.5 rounded-2xl"
            : "w-9 h-9 sm:w-10 sm:h-10 p-1.5"
        }`}
      >
        <div className="absolute inset-0 bg-blue-500/10 rounded-xl blur-sm -z-10 group-hover:bg-blue-500/20 transition-all" />
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(56,189,248,0.4)]"
        >
          <defs>
            <linearGradient id="syncd-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="syncd-accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>

          {/* Sync Nodes Orbit Flow */}
          <path
            d="M8 18C8 12.477 12.477 8 18 8C21.866 8 25.21 10.187 26.88 13.4"
            stroke="url(#syncd-blue-grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M28 18C28 23.523 23.523 28 18 28C14.134 28 10.79 25.813 9.12 22.6"
            stroke="url(#syncd-accent-grad)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Velocity arrow tips */}
          <path
            d="M23.5 13.5H27V10"
            stroke="url(#syncd-blue-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.5 22.5H9V26"
            stroke="url(#syncd-accent-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Pulsing Core */}
          <circle cx="18" cy="18" r="3" fill="#60a5fa" />
          <circle cx="18" cy="18" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Modern Gradient Typography */}
      <div className="flex items-baseline">
        <span
          className={`font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent group-hover:from-white group-hover:to-blue-300 transition-all ${
            isLarge
              ? "text-4xl sm:text-6xl lg:text-7xl tracking-widest drop-shadow-[0_4px_16px_rgba(59,130,246,0.3)]"
              : "text-2xl sm:text-3xl font-extrabold"
          }`}
        >
          SYNCD
        </span>
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-400 ml-1 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      </div>
    </div>
  );
}



