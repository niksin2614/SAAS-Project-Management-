"use client";

import { useState, useEffect } from "react";
import { OrganizationList, useOrganization, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyRound, PlusCircle, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { joinOrganizationWithCode } from "@/actions/invites";
import CustomCreateOrg from "@/components/custom-create-org";
import { toast } from "sonner";
import Link from "next/link";

export default function Onboarding() {
  const { organization, isLoaded } = useOrganization();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [activeTab, setActiveTab] = useState("join");

  // Auto-fill invite code from URL if provided (?code=SYNCD-...)
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setInviteCode(codeFromUrl.toUpperCase());
      setActiveTab("join");
    }
  }, [searchParams]);

  // If already in an organization and not joining via code, redirect immediately
  useEffect(() => {
    if (isLoaded && organization && !searchParams.get("code")) {
      const slugOrId = organization.slug || organization.id;
      if (slugOrId) {
        router.replace(`/organization/${slugOrId}`);
      }
    }
  }, [organization, isLoaded, router, searchParams]);

  const handleJoin = async (e) => {
    if (e) e.preventDefault();
    const code = inviteCode.trim().toUpperCase();
    if (!code) {
      toast.error("Please enter your team's invite code");
      return;
    }

    setIsJoining(true);
    try {
      const res = await joinOrganizationWithCode(code);
      if (res.success) {
        toast.success(`Successfully joined ${res.orgName || "Organization"}!`);
        window.location.href = `/organization/${res.organizationId}`;
      }
    } catch (err) {
      toast.error(err.message || "Failed to join organization. Please check the code.");
    } finally {
      setIsJoining(false);
    }
  };

  // If already in an organization and redirecting, show a clean transition loader instead of creation forms
  if (isLoaded && organization && !searchParams.get("code")) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 py-16">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full bg-blue-500/20 blur-md animate-pulse" />
          <Loader2 className="h-9 w-9 animate-spin text-blue-500 relative z-10" />
        </div>
        <p className="text-sm font-medium text-slate-400 animate-pulse">
          Opening {organization.name}&apos;s Workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center min-h-[75vh]">
      {/* Existing organization notification if already a member */}
      {isLoaded && organization && (
        <div className="mb-6 text-center">
          <Link href={`/organization/${organization.slug || organization.id}`}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-base px-6 shadow-xl shadow-blue-600/20">
              Continue to {organization.name}&apos;s Workspace
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      )}

      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-[11px] font-bold mb-2 shadow-inner">
            <Sparkles className="w-3 h-3 text-blue-400" />
            SYNCD Team Workspace Setup
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Join your team&apos;s project workspace or create a new organization.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Custom Pill Switcher with proper sizing */}
          <TabsList className="grid grid-cols-2 h-auto w-full bg-slate-900/90 border border-slate-800 p-1 rounded-xl mb-4 shadow-md">
            <TabsTrigger
              value="join"
              className="flex items-center justify-center gap-1.5 h-9 rounded-lg font-bold text-xs text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Join with Code
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="flex items-center justify-center gap-1.5 h-9 rounded-lg font-bold text-xs text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Organization
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Join with Code (For Members) */}
          <TabsContent value="join" className="mt-0 focus-visible:outline-none">
            <Card className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
              <CardHeader className="p-0 pb-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-2 shadow-md shadow-blue-500/25">
                  <KeyRound className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-white">
                  Join Existing Organization
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs mt-0.5">
                  Enter the invite code provided by your organization admin.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <form onSubmit={handleJoin} className="space-y-3.5">
                  <div>
                    <label htmlFor="code" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Invite Code
                    </label>
                    <Input
                      id="code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SYNCD-8A9X2"
                      className="h-11 text-center font-mono font-bold text-base sm:text-lg tracking-widest bg-slate-900 border-2 border-slate-800 focus-visible:border-blue-500 text-blue-300 placeholder:text-slate-600 rounded-xl shadow-inner"
                      disabled={isJoining}
                      maxLength={15}
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!inviteCode.trim() || isJoining}
                    className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Joining Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Join Organization</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-1.5 text-center">
                  <p className="font-semibold text-slate-300 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Team Enrollment
                  </p>
                  <p>
                    You will be enrolled as an active <strong>Team Member</strong> and gain instant access to sprints, task boards, and chat.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Create Organization (Custom Modern Glassmorphism Form) */}
          <TabsContent value="create" className="mt-0 focus-visible:outline-none flex justify-center">
            <CustomCreateOrg />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
