"use client";

import { useState } from "react";
import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, ArrowRight, Loader2, Shield, Layers } from "lucide-react";
import { toast } from "sonner";

export default function CustomCreateOrg({ onSuccess }) {
  const { createOrganization, isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });
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

      if (userMemberships?.revalidate) {
        await userMemberships.revalidate();
      }

      if (setActive) {
        await setActive({ organization: org.id });
      }

      toast.success(`Organization "${org.name}" created successfully!`);
      if (onSuccess) {
        onSuccess(org);
      }
      router.push(`/organization/${org.id}`);
    } catch (err) {
      const errMsg =
        err?.errors?.[0]?.message ||
        err.message ||
        "Failed to create organization";
      toast.error(errMsg);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#09090c] p-5 sm:p-6 rounded-2xl border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-neutral-100">
      <div className="text-center mb-5">
        <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-white mx-auto mb-2.5 shadow-md">
          <Building2 className="w-5 h-5 text-neutral-200" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Create Organization Workspace
        </h2>
        <p className="text-neutral-400 text-xs mt-0.5">
          Establish a dedicated workspace for all projects, sprints, and team members.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label
            htmlFor="orgName"
            className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5"
          >
            Organization Name
          </label>
          <Input
            id="orgName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Engineering, Studio Alpha"
            className="h-10 bg-[#050507] border border-white/[0.14] rounded-xl px-3.5 text-xs sm:text-sm font-medium text-white placeholder:text-neutral-600 focus-visible:border-white/50 shadow-inner"
            disabled={isCreating || !isLoaded}
            autoFocus
            maxLength={50}
          />
        </div>

        <div className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[11px] text-neutral-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-200">
            <Layers className="w-3.5 h-3.5 text-neutral-300" />
            <span>Workspace Capabilities</span>
          </div>
          <p className="leading-relaxed">
            Generates a unique 6-digit Join Code for instant team onboarding and activates real-time sprint chat.
          </p>
        </div>

        <Button
          type="submit"
          disabled={!name.trim() || isCreating || !isLoaded}
          className="w-full h-10 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
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

      <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 font-mono">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <span>Designated as Organization Admin</span>
      </div>
    </div>
  );
}
