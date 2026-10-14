"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white flex flex-col items-center justify-center min-h-screen px-4 text-center antialiased">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white tracking-tight">
          Critical Application Error
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm mb-6 max-w-md leading-relaxed">
          {error?.message || "A global error occurred. Please reload the application."}
        </p>
        <Button
          onClick={() => reset()}
          className="h-10 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-md"
        >
          Reload SYNCD
        </Button>
      </body>
    </html>
  );
}
