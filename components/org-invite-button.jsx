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
        className="h-8 sm:h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm"
      >
        <UserPlus className="w-3.5 h-3.5 text-blue-400" />
        <span>Invite Code</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-slate-950 border border-slate-800 p-6 text-slate-100 rounded-3xl shadow-2xl">
          <DialogHeader className="pb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/25">
              <KeyRound className="w-6 h-6" />
            </div>
            <DialogTitle className="text-2xl font-bold text-white">
              Organization Invite Code
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-400">
              Share this code or link with your teammates to let them join <strong className="text-slate-200">{orgName || "Organization"}</strong> instantly without creating a separate org.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm">Fetching team invite code...</p>
            </div>
          ) : inviteData ? (
            <div className="space-y-5 pt-2">
              {/* Code Box */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Unique Join Code
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-900 border-2 border-indigo-500/30 rounded-2xl p-3.5 text-center font-mono font-black text-xl sm:text-2xl tracking-widest text-indigo-300 shadow-inner selection:bg-indigo-600">
                    {inviteData.code}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(inviteData.code, "code")}
                    className="h-14 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/20"
                  >
                    {copiedCode ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* Direct Link Box */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Direct Join Link
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={inviteData.inviteUrl}
                    className="bg-slate-900 border-slate-800 text-slate-300 text-xs h-11 font-mono rounded-xl truncate"
                  />
                  <Button
                    onClick={() => copyToClipboard(inviteData.inviteUrl, "link")}
                    variant="outline"
                    className="h-11 px-3.5 rounded-xl border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* How it works note */}
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
                <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Member Access
                </p>
                <p className="leading-relaxed">
                  When new members sign in and enter this code on their onboarding screen, they will automatically join as a <strong>Member</strong> and go straight to the project dashboard.
                </p>
              </div>

              {/* Admin actions */}
              {isAdmin && (
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Need to reset access?</span>
                  <Button
                    variant="ghost"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    className="text-xs text-slate-400 hover:text-red-400 p-0 h-auto font-medium flex items-center gap-1"
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
