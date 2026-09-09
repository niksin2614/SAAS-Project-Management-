import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import { PenBox } from "lucide-react";
import Logo from "./logo";
import OrgSwitcher from "./org-switcher";
import UserLoading from "./user-loading";

export default function Header() {
  return (
    <header className="container mx-auto">
      <nav className="py-3 sm:py-3.5 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Logo size="default" />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/project/create">
            <Button variant="destructive" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm px-3 flex items-center gap-1.5 rounded-lg shadow-sm">
              <PenBox size={15} />
              <span className="hidden md:inline">Create Project</span>
            </Button>
          </Link>
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm px-3 rounded-lg">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <OrgSwitcher />
            <UserMenu />
          </SignedIn>
        </div>
      </nav>

      <UserLoading />
    </header>
  );
}
