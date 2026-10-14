"use client";

import { useState, useEffect, useCallback } from "react";
import ParticleWave from "./particle-wave";

export default function CinematicIntro() {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState("hidden"); // "hidden" | "black" | "wave" | "wordmark" | "exit" | "done"

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem("syncd_intro_viewed", "true");
    } catch (e) {
      // ignore storage errors
    }
    setStage("exit");
    setTimeout(() => {
      setStage("done");
    }, 550);
  }, []);

  const startIntro = useCallback(() => {
    setStage("black");

    const t1 = setTimeout(() => {
      setStage("wave");
    }, 350);

    const t2 = setTimeout(() => {
      setStage("wordmark");
    }, 1000);

    const t3 = setTimeout(() => {
      finishIntro();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [finishIntro]);

  useEffect(() => {
    setMounted(true);

    // Support force re-trigger via query param or custom event
    const searchParams = new URLSearchParams(window.location.search);
    const forceIntro = searchParams.get("intro") === "1";

    const hasViewed =
      !forceIntro &&
      typeof window !== "undefined" &&
      sessionStorage.getItem("syncd_intro_viewed") === "true";

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasViewed || (prefersReducedMotion && !forceIntro)) {
      setStage("done");
      return;
    }

    const cleanup = startIntro();

    // Listen for manual replay request
    const handleReplay = () => {
      setStage("black");
      startIntro();
    };
    window.addEventListener("syncd:replay-intro", handleReplay);

    // ESC key skips intro instantly
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        finishIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (cleanup) cleanup();
      window.removeEventListener("syncd:replay-intro", handleReplay);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [startIntro, finishIntro]);

  if (!mounted || stage === "done" || stage === "hidden") {
    return null;
  }

  const isWaveVisible = stage === "wave" || stage === "wordmark";
  const isWordmarkVisible = stage === "wordmark";
  const isExiting = stage === "exit";

  return (
    <div
      role="dialog"
      aria-label="SYNCD Cinematic Introduction"
      className={`fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-out ${
        isExiting ? "opacity-0 pointer-events-none scale-[1.01]" : "opacity-100 pointer-events-auto"
      }`}
    >
      {/* 3D Mathematical Wave Canvas */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isWaveVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <ParticleWave speed={1.1} opacity={0.95} />
      </div>

      {/* Vignette gradients */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none" />

      {/* Center Cinematic Wordmark */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 transition-all duration-1000 ease-out transform ${
          isWordmarkVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"
        }`}
      >
        {/* Geometric Mark */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.08)]">
            <svg
              viewBox="0 0 32 32"
              className="w-9 h-9 sm:w-11 sm:h-11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 16C7 11.029 11.029 7 16 7C19.5 7 22.5 9 24.2 12L20.6 13.8C19.5 11.8 17.8 10.8 16 10.8C13.128 10.8 10.8 13.128 10.8 16C10.8 17.2 11.2 18.3 12 19.2L8.9 21.6C7.7 20 7 18.1 7 16Z"
                fill="#ffffff"
              />
              <path
                d="M25 16C25 20.971 20.971 25 16 25C12.5 25 9.5 23 7.8 20L11.4 18.2C12.5 20.2 14.2 21.2 16 21.2C18.872 21.2 21.2 18.872 21.2 16C21.2 14.8 20.8 13.7 20 12.8L23.1 10.4C24.3 12 25 13.9 25 16Z"
                fill="#94a3b8"
              />
              <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Brand Wordmark */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-[0.28em] text-white uppercase leading-none pl-[0.28em]">
          SYNCD
        </h1>

        {/* Minimal Subtitle */}
        <p className="mt-3 text-xs sm:text-sm font-medium tracking-[0.3em] uppercase text-neutral-400 pl-[0.3em]">
          Project Intelligence Platform
        </p>

        {/* Status Line */}
        <div className="mt-6 flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-neutral-300 uppercase">
            System Synchronized
          </span>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={finishIntro}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 text-xs font-mono transition-all backdrop-blur-md"
        title="Skip intro animation"
      >
        <span>Skip</span>
        <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] text-neutral-300">
          ESC
        </kbd>
      </button>
    </div>
  );
}
