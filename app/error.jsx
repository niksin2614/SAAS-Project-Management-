"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold mb-4 text-red-400">Something went wrong!</h2>
      <p className="text-slate-400 mb-6 max-w-md">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <Button
        onClick={() => reset()}
        variant="default"
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Try Again
      </Button>
    </div>
  );
}
