"use client";

import React, { useEffect, useRef } from "react";

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      el.classList.add("is-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.05 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleReplayIntro = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("syncd:replay-intro"));
    }
  };

  return (
    <footer
      ref={footerRef}
      data-reveal
      className="border-t border-white/[0.08] bg-black/90 backdrop-blur-md py-8 mt-16"
    >
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono tracking-wider uppercase text-neutral-300">
            SYNCD v1.0
          </span>
          <span className="text-neutral-400">•</span>
          <span>Precision Agile Intelligence</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleReplayIntro}
            className="text-neutral-300 hover:text-white transition-colors underline-offset-4 hover:underline font-medium cursor-pointer"
          >
            Replay Intro
          </button>
          <p className="text-neutral-400">
            © {new Date().getFullYear()} SYNCD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
