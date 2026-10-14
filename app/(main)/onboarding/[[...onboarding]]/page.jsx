"use client";

import { useState, useEffect } from "react";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  KeyRound,
  PlusCircle,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { joinOrganizationWithCode } from "@/actions/invites";
import CustomCreateOrg from "@/components/custom-create-org";
import { toast } from "sonner";
import Link from "next/link";

export default function Onboarding() {
  const { organization, isLoaded } = useOrganization();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [activeTab, setActiveTab] = useState("join");

  // Auto-fill invite code from URL if provided (?code=SYNCD-...) or tab (?tab=create)
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    const tabFromUrl = searchParams.get("tab");
    if (codeFromUrl) {
      setInviteCode(codeFromUrl.toUpperCase());
      setActiveTab("join");
    } else if (tabFromUrl === "create") {
      setActiveTab("create");
    }
  }, [searchParams]);

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
        if (res.alreadyMember) {
          toast.info(`You are already a member of ${res.orgName || "this organization"}!`);
        } else {
          toast.success(`Successfully joined ${res.orgName || "Organization"}!`);
        }

        if (userMemberships?.revalidate) {
          await userMemberships.revalidate();
        }

        if (setActive) {
          await setActive({ organization: res.organizationId });
        }

        router.push(`/organization/${res.organizationId}`);
      }
    } catch (err) {
      toast.error(
        err.message || "Failed to join organization. Please check the code."
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-14 flex flex-col items-center justify-center min-h-[78vh]">
      {/* Existing organization notification if already a member */}
      {isLoaded && organization && (
        <div className="mb-6 text-center">
          <Link href={`/organization/${organization.slug || organization.id}`}>
            <Button
              size="lg"
              className="bg-white hover:bg-neutral-200 text-black font-semibold gap-2 text-sm px-6 shadow-lg shadow-white/10 rounded-lg"
            >
              Continue to {organization.name}&apos;s Workspace
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-neutral-300 text-[11px] font-mono tracking-widest uppercase mb-3 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SYNCD Workspace Setup
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto leading-relaxed">
            Join your engineering team with an invite code, or establish a new organization.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Segmented Pill Switcher */}
          <TabsList className="grid grid-cols-2 h-auto w-full bg-[#08080a] border border-white/[0.1] p-1 rounded-xl mb-4 shadow-sm">
            <TabsTrigger
              value="join"
              className="flex items-center justify-center gap-1.5 h-9 rounded-lg font-semibold text-xs text-neutral-400 data-[state=active]:bg-white data-[state=active]:text-black transition-all shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Join with Code
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="flex items-center justify-center gap-1.5 h-9 rounded-lg font-semibold text-xs text-neutral-400 data-[state=active]:bg-white data-[state=active]:text-black transition-all shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Organization
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Join with Code (For Members) */}
          <TabsContent value="join" className="mt-0 focus-visible:outline-none">
            <Card className="bg-[#09090c] border border-white/[0.1] rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <CardHeader className="p-0 pb-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-white mx-auto mb-2.5 shadow-md">
                  <KeyRound className="w-5 h-5 text-neutral-200" />
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Join Team Workspace
                </CardTitle>
                <CardDescription className="text-neutral-400 text-xs mt-0.5">
                  Enter the 6-digit workspace invite code shared by your admin.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 space-y-4">
                <form onSubmit={handleJoin} className="space-y-4">
                  <div>
                    <label
                      htmlFor="code"
                      className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
                    >
                      Invite Code
                    </label>
                    <Input
                      id="code"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="SYNCD-XXXXXX"
                      className="h-11 text-center font-mono font-bold text-base sm:text-lg tracking-widest bg-[#050507] border border-white/[0.14] focus-visible:border-white/50 text-white placeholder:text-neutral-600 rounded-xl shadow-inner"
                      disabled={isJoining}
                      maxLength={15}
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={!inviteCode.trim() || isJoining}
                    className="w-full h-10 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Join Organization</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-neutral-400 space-y-1 text-center">
                  <p className="font-semibold text-neutral-200 flex items-center justify-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Team Access
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Automatically grants member permissions to view active sprints,
                    drag-and-drop tasks, and participate in team chat.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Create Organization */}
          <TabsContent value="create" className="mt-0 focus-visible:outline-none flex justify-center">
            <CustomCreateOrg />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
