"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-[55vh] flex flex-col items-center justify-center gap-3 py-16 animate-in fade-in duration-200">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-12 h-12 rounded-full bg-white/5 blur-md animate-pulse" />
        <Loader2 className="h-8 w-8 animate-spin text-white relative z-10" />
      </div>
      <p className="text-xs font-mono font-medium text-neutral-400 tracking-widest uppercase animate-pulse">
        SYNCD • Loading...
      </p>
    </div>
  );
}
