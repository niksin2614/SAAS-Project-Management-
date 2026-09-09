import React, { Suspense } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import { PenBox } from "lucide-react";
import Logo from "./logo";
import OrgSwitcher from "./org-switcher";
import { checkUser } from "@/lib/checkUser";
import UserLoading from "./user-loading";

async function UserSync() {
  try {
    await checkUser();
  } catch (e) {
    // Graceful fallback
  }
  return null;
}

export default function Header() {
  return (
    <header className="container mx-auto">
      <Suspense fallback={null}>
        <UserSync />
      </Suspense>
      <nav className="py-6 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Logo size="default" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/project/create">
            <Button variant="destructive" className="flex items-center gap-2">
              <PenBox size={18} />
              <span className="hidden md:inline">Create Project</span>
            </Button>
          </Link>
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline">Login</Button>
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
