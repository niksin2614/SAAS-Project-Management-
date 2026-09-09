"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="bg-slate-950 text-white flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-red-500">Critical Application Error</h2>
        <p className="text-slate-400 mb-6 max-w-md">
          {error?.message || "A global error occurred. Please refresh or try again."}
        </p>
        <Button
          onClick={() => reset()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Reload Application
        </Button>
      </body>
    </html>
  );
}
