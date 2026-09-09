import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organization(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId, orgSlug } = auth();

  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }

  // If user already has an active organization and visits /onboarding directly without an invite code, redirect straight to their organization workspace
  if (
    userId &&
    orgId &&
    req.nextUrl.pathname.startsWith("/onboarding") &&
    !req.nextUrl.searchParams.get("code")
  ) {
    const orgTarget = orgSlug || orgId;
    return NextResponse.redirect(new URL(`/organization/${orgTarget}`, req.url));
  }

  if (
    userId &&
    !orgId &&
    req.nextUrl.pathname !== "/onboarding" &&
    !req.nextUrl.pathname.startsWith("/organization") &&
    !req.nextUrl.pathname.startsWith("/project") &&
    req.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
