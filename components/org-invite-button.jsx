"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserPlus, Copy, Check, RefreshCw, KeyRound, Link2, ShieldCheck, Loader2 } from "lucide-react";
import { getOrCreateOrgInviteCode, regenerateOrgInviteCode } from "@/actions/invites";
import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";

export default function OrgInviteButton({ orgId, orgName, variant = "default" }) {
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";

  const [isOpen, setIsOpen] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchCode = async () => {
    if (!orgId) return;
    setIsLoading(true);
    setIsOpen(true);
    try {
      const data = await getOrCreateOrgInviteCode(orgId, orgName);
      setInviteData(data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch invite code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm("Regenerating the code will invalidate the previous code. Continue?")) return;
    setIsRegenerating(true);
    try {
      const data = await regenerateOrgInviteCode(orgId);
      setInviteData((prev) => ({ ...prev, ...data }));
      toast.success("New invite code generated!");
    } catch (err) {
      toast.error(err.message || "Failed to regenerate code");
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast.success("Invite Code copied to clipboard!");
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast.success("Direct Join Link copied to clipboard!");
    }
  };

  if (!orgId) return null;

  return (
    <>
      <Button
        onClick={fetchCode}
        variant={variant === "outline" ? "outline" : "default"}
        size="sm"
        className="h-8 sm:h-9 px-3 rounded-lg bg-[#0c0c0e] border border-white/[0.12] hover:border-white/[0.25] hover:bg-[#141418] text-neutral-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm"
      >
        <UserPlus className="w-3.5 h-3.5 text-neutral-300" />
        <span>Invite Code</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-[#09090c] border border-white/[0.12] p-6 text-neutral-100 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.95)]">
          <DialogHeader className="pb-2">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-white mb-2.5 shadow-md">
              <KeyRound className="w-5 h-5 text-neutral-200" />
            </div>
            <DialogTitle className="text-xl font-bold text-white tracking-tight">
              Organization Invite Code
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Share this code or join link with your teammates to let them join{" "}
              <strong className="text-neutral-200">{orgName || "Organization"}</strong> instantly without creating a separate org.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-neutral-400 gap-3">
              <Loader2 className="w-7 h-7 animate-spin text-white" />
              <p className="text-xs font-mono">Fetching workspace invite code...</p>
            </div>
          ) : inviteData ? (
            <div className="space-y-4 pt-1">
              {/* Code Box */}
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                  Unique Join Code
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black border border-white/[0.18] rounded-xl p-3 text-center font-mono font-bold text-xl tracking-[0.2em] text-white shadow-inner selection:bg-neutral-800">
                    {inviteData.code}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(inviteData.code, "code")}
                    className="h-12 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold shadow-md transition-all"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Direct Link Box */}
              <div>
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5 block">
                  Direct Join Link
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={inviteData.inviteUrl}
                    className="bg-black border-white/[0.12] text-neutral-300 text-xs h-10 font-mono rounded-lg truncate"
                  />
                  <Button
                    onClick={() => copyToClipboard(inviteData.inviteUrl, "link")}
                    variant="outline"
                    className="h-10 px-3 rounded-lg border-white/[0.14] bg-[#0c0c0e] hover:bg-[#141418] text-neutral-200"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* How it works note */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs text-neutral-400 space-y-1">
                <p className="font-semibold text-neutral-200 flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Member Access
                </p>
                <p className="text-[11px] leading-relaxed">
                  When new members sign in and enter this code on onboarding, they will automatically join as a <strong>Member</strong> and proceed to the project dashboard.
                </p>
              </div>

              {/* Admin actions */}
              {isAdmin && (
                <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-mono text-[11px]">Need to reset access?</span>
                  <Button
                    variant="ghost"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="text-xs text-neutral-400 hover:text-red-400 p-0 h-auto font-medium flex items-center gap-1 transition-colors"
                  >
                    {isRegenerating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    Regenerate Code
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
