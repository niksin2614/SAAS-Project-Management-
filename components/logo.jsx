import React from "react";

export default function Logo({ size = "default", className = "" }) {
  const isLarge = size === "lg";
  const letters = ["S", "Y", "N", "C", "D"];

  return (
    <div
      className={`inline-flex items-center gap-1.5 sm:gap-2 font-black select-none ${className}`}
      aria-label="SYNCD Logo"
    >
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`
            flex items-center justify-center font-extrabold rounded-md sm:rounded-lg
            bg-[#6071a9]/50 hover:bg-[#6071a9]/70
            text-slate-100 border border-[#7a8cc5]/40
            shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]
            backdrop-blur-md transition-all duration-200
            hover:scale-105 hover:border-blue-300 hover:text-white
            ${
              isLarge
                ? "w-11 h-14 sm:w-16 sm:h-20 text-3xl sm:text-5xl font-black"
                : "w-7 h-8 sm:w-8 sm:h-9 text-base sm:text-lg font-bold"
            }
          `}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
