"use client";

import { useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Sparkles, ArrowRight, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function CustomCreateOrg() {
  const { createOrganization, isLoaded, setActive } = useOrganizationList();
  const router = useRouter();

  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !createOrganization) return;

    setIsCreating(true);
    try {
      const org = await createOrganization({
        name: name.trim(),
      });

      if (setActive) {
        await setActive({ organization: org.id });
      }

      toast.success(`Organization "${org.name}" created successfully!`);
      router.push(`/organization/${org.id}`);
    } catch (err) {
      const errMsg = err?.errors?.[0]?.message || err.message || "Failed to create organization";
      toast.error(errMsg);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950 p-5 sm:p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-2xl text-slate-100">
      <div className="text-center mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto mb-2 shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
          <Building2 className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Create Company Workspace
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Set up a unified hub for all your projects, sprints, and team members.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-3.5">
        <div>
          <label htmlFor="orgName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Organization Name
          </label>
          <div className="relative">
            <Input
              id="orgName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Studio, TechCorp"
              className="h-10 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 text-xs sm:text-sm font-semibold text-slate-100 placeholder:text-slate-500 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 shadow-inner"
              disabled={isCreating || !isLoaded}
              autoFocus
              maxLength={50}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-[11px] text-slate-300 space-y-0.5">
          <div className="flex items-center gap-1 font-semibold text-indigo-300">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Workspace Features:</span>
          </div>
          <p className="text-slate-400 leading-normal">
            Generates an instant 6-digit Join Code for team members and unlocks real-time sprint chat.
          </p>
        </div>

        <Button
          type="submit"
          disabled={!name.trim() || isCreating || !isLoaded}
          className="w-full h-10 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-50"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Initializing Workspace...</span>
            </>
          ) : (
            <>
              <span>Create Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <Shield className="w-3 h-3 text-emerald-400" />
        <span>You will be designated as the Workspace Admin</span>
      </div>
    </div>
  );
}
