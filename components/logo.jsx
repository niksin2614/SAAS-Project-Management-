import React from "react";

export default function Logo({ size = "default", className = "" }) {
  const isLarge = size === "lg";

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none shrink-0 ${className}`}
      aria-label="SYNCD Logo"
    >
      {/* Geometric Sync Icon Mark */}
      <div
        className={`flex items-center justify-center shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-md ${
          isLarge ? "w-12 h-12 p-2" : "w-8 h-8 p-1.5"
        }`}
        style={{ flexShrink: 0, minWidth: isLarge ? "48px" : "32px", minHeight: isLarge ? "48px" : "32px" }}
      >
        <svg
          viewBox="0 0 32 32"
          width={isLarge ? "32" : "20"}
          height={isLarge ? "32" : "20"}
          fill="none"
          className="shrink-0 block"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <path
            d="M7 16C7 11.029 11.029 7 16 7C19.5 7 22.5 9 24.2 12L20.6 13.8C19.5 11.8 17.8 10.8 16 10.8C13.128 10.8 10.8 13.128 10.8 16C10.8 17.2 11.2 18.3 12 19.2L8.9 21.6C7.7 20 7 18.1 7 16Z"
            fill="#38bdf8"
          />
          <path
            d="M25 16C25 20.971 20.971 25 16 25C12.5 25 9.5 23 7.8 20L11.4 18.2C12.5 20.2 14.2 21.2 16 21.2C18.872 21.2 21.2 18.872 21.2 16C21.2 14.8 20.8 13.7 20 12.8L23.1 10.4C24.3 12 25 13.9 25 16Z"
            fill="#6366f1"
          />
          <circle cx="16" cy="16" r="2.5" fill="#38bdf8" />
        </svg>
      </div>

      {/* Modern Wordmark */}
      <span
        className={`font-black tracking-wider uppercase text-white ${
          isLarge ? "text-2xl sm:text-3xl tracking-widest" : "text-lg sm:text-xl"
        }`}
        style={{ color: "#ffffff", letterSpacing: "0.08em" }}
      >
        SYNCD
      </span>
    </div>
  );
}

