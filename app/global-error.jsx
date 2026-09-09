"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="bg-slate-950 text-slate-100 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
