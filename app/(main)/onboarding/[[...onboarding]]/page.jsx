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

  // If already in an organization and not joining via code, redirect
  useEffect(() => {
    if (isLoaded && organization && !searchParams.get("code")) {
      const slugOrId = organization.slug || organization.id;
      if (slugOrId) {
        router.push(`/organization/${slugOrId}`);
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

      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-bold mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            SYNCD Team Workspace Setup
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            Join your team&apos;s project workspace or create a new organization.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Custom Pill Switcher with proper sizing */}
          <TabsList className="grid grid-cols-2 h-auto w-full bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl mb-6 shadow-lg">
            <TabsTrigger
              value="join"
              className="flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
              Join with Code
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Create Organization
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Join with Code (For Members) */}
          <TabsContent value="join" className="mt-0 focus-visible:outline-none">
            <Card className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              <CardHeader className="p-0 pb-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/25">
                  <KeyRound className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  Join Existing Organization
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm mt-1">
                  Enter the invite code provided by your organization admin.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 space-y-5">
                <form onSubmit={handleJoin} className="space-y-4">
                  <div>
                    <label htmlFor="code" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Invite Code
                    </label>
                    <Input
                      id="code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SYNCD-8A9X2"
                      className="h-14 text-center font-mono font-black text-xl sm:text-2xl tracking-widest bg-slate-900 border-2 border-slate-800 focus-visible:border-blue-500 text-blue-300 placeholder:text-slate-600 rounded-2xl shadow-inner"
                      disabled={isJoining}
                      maxLength={15}
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!inviteCode.trim() || isJoining}
                    className="w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Joining Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Join Organization</span>
                        <ArrowRight className="w-5 h-5" />
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
