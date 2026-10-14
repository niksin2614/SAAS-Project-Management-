"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KeyRound,
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { joinOrganizationWithCode } from "@/actions/invites";
import { toast } from "sonner";

export default function JoinOrgDialog({ isOpen, onOpenChange, onSuccess }) {
  const router = useRouter();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = (open) => {
    if (!isJoining) {
      if (!open) {
        setErrorMessage("");
        setInviteCode("");
      }
      onOpenChange(open);
    }
  };

  const handleJoin = async (e) => {
    if (e) e.preventDefault();
    const code = inviteCode.trim().toUpperCase();

    if (!code) {
      setErrorMessage("Please enter an invitation code");
      return;
    }

    setIsJoining(true);
    setErrorMessage("");

    try {
      const res = await joinOrganizationWithCode(code);

      if (!res?.success) {
        throw new Error(res?.error || "Failed to join organization. Please verify the code.");
      }

      if (res.alreadyMember) {
        toast.info(
          `You already belong to ${res.orgName || "this workspace"}. Switched to workspace.`
        );
      } else {
        toast.success(`Successfully joined ${res.orgName || "Organization"}!`);
      }

      // Revalidate Clerk user memberships so it immediately appears in the switcher
      if (userMemberships?.revalidate) {
        await userMemberships.revalidate();
      }

      // Set newly joined organization as the active organization in Clerk session
      if (setActive) {
        await setActive({ organization: res.organizationId });
      }

      // Reset local state and close dialog
      setInviteCode("");
      setErrorMessage("");
      handleClose(false);

      if (onSuccess) {
        onSuccess(res);
      }

      // Seamlessly navigate to the organization workspace
      router.push(`/organization/${res.organizationId}`);
    } catch (err) {
      const message =
        err?.message || "Failed to join organization. Please check the code.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-[#09090c] border border-white/[0.12] p-6 text-neutral-100 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
        <DialogHeader className="pb-2 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-white mb-2.5 shadow-md">
            <KeyRound className="w-5 h-5 text-neutral-200" />
          </div>
          <DialogTitle className="text-xl font-bold text-white tracking-tight">
            Join Organization Workspace
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-400">
            Enter the 6-digit workspace invitation code shared by your organization admin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleJoin} className="space-y-4 pt-1">
          <div>
            <label
              htmlFor="dialogInviteCode"
              className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
            >
              Invitation Code
            </label>
            <Input
              id="dialogInviteCode"
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value.toUpperCase());
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="SYNCD-XXXXXX"
              className="h-11 text-center font-mono font-bold text-base sm:text-lg tracking-widest bg-[#050507] border border-white/[0.14] focus-visible:border-white/50 text-white placeholder:text-neutral-600 rounded-xl shadow-inner selection:bg-neutral-800"
              disabled={isJoining}
              maxLength={15}
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in-50">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Informational Guidance */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant Team Membership</span>
            </div>
            <p className="leading-relaxed">
              Validating this code adds you as a member with full access to active sprints, task boards, and team hub chat.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isJoining}
              onClick={() => handleClose(false)}
              className="h-10 px-4 rounded-xl border-white/[0.12] bg-[#0c0c0e] hover:bg-[#141418] text-neutral-300 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!inviteCode.trim() || isJoining}
              className="h-10 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <span>Join Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
