"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold mb-4 text-slate-100">Something went wrong</h2>
      <p className="text-slate-400 mb-6 max-w-md">
        An unexpected error occurred. Please try again or refresh the page.
      </p>
      <Button onClick={() => reset()} variant="default">
        Try again
      </Button>
    </div>
  );
}
