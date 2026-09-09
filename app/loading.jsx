"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 py-16 animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center">
        {/* Glow Ring */}
        <div className="absolute w-12 h-12 rounded-full bg-blue-500/20 blur-md animate-pulse" />
        <Loader2 className="h-9 w-9 animate-spin text-blue-500 relative z-10" />
      </div>
      <p className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
}
