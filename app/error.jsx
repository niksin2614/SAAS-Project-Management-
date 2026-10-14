"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-rose-400 mb-4 shadow-md">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white tracking-tight">
        Unexpected Application State
      </h2>
      <p className="text-neutral-400 text-xs sm:text-sm mb-6 max-w-md leading-relaxed">
        {error?.message || "An unexpected error occurred during execution. Please retry."}
      </p>
      <Button
        onClick={() => reset()}
        className="h-10 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-md gap-2"
      >
        <RotateCcw size={15} />
        <span>Try Again</span>
      </Button>
    </div>
  );
}
