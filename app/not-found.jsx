import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="text-7xl sm:text-9xl font-black font-mono text-neutral-800 tracking-tighter select-none mb-2">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mb-8 leading-relaxed">
        The resource or route you requested does not exist or may have been relocated.
      </p>
      <Link href="/">
        <Button
          size="sm"
          className="h-10 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-md gap-2"
        >
          <ArrowLeft size={16} />
          <span>Return to SYNCD</span>
        </Button>
      </Link>
    </div>
  );
}
