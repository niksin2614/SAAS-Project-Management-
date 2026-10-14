import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import { Plus } from "lucide-react";
import Logo from "./logo";
import OrgSwitcher from "./org-switcher";
import UserLoading from "./user-loading";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/80 backdrop-blur-xl transition-all">
      <div className="container mx-auto">
        <nav className="h-14 sm:h-16 px-4 flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-90"
            aria-label="SYNCD Home"
          >
            <Logo size="default" />
          </Link>

          {/* Minimal Dark Navigation Destinations */}
          <div className="hidden md:flex items-center gap-7 text-[11px] font-mono tracking-widest uppercase text-neutral-400">
            <Link href="/#preview" className="hover:text-white transition-colors">
              Platform
            </Link>
            <Link href="/#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/#faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/project/create">
              <Button
                size="sm"
                className="h-8 sm:h-9 text-xs sm:text-sm px-3.5 flex items-center gap-1.5 rounded-lg font-semibold bg-white text-black hover:bg-neutral-200 shadow-sm transition-all"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span className="hidden sm:inline">Create Project</span>
              </Button>
            </Link>

            <SignedOut>
              <SignInButton forceRedirectUrl="/onboarding">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 sm:h-9 text-xs sm:text-sm px-3.5 rounded-lg border-white/15 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 hover:text-white transition-colors"
                >
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <OrgSwitcher />
              <UserMenu />
            </SignedIn>
          </div>
        </nav>

        <UserLoading />
      </div>
    </header>
  );
}
