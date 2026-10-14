/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  SignedIn,
  useOrganization,
  useOrganizationList,
  useUser,
  OrganizationProfile,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Building2,
  ChevronsUpDown,
  Check,
  PlusCircle,
  KeyRound,
  Settings,
} from "lucide-react";
import JoinOrgDialog from "@/components/join-org-dialog";
import CustomCreateOrg from "@/components/custom-create-org";

const OrgSwitcher = () => {
  const { organization, membership, isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const {
    isLoaded: isListLoaded,
    setActive,
    userMemberships,
  } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const pathname = usePathname();
  const router = useRouter();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  if (pathname === "/") {
    return null;
  }

  if (!isOrgLoaded || !isUserLoaded || !isListLoaded) {
    return (
      <div className="h-8 sm:h-9 w-32 rounded-lg bg-white/[0.04] border border-white/[0.08] animate-pulse" />
    );
  }

  const handleSelectOrg = async (targetOrgId, targetSlug) => {
    setIsPopoverOpen(false);
    if (organization?.id !== targetOrgId && setActive) {
      await setActive({ organization: targetOrgId });
      router.push(`/organization/${targetSlug || targetOrgId}`);
    }
  };

  return (
    <div className="flex justify-end items-center">
      <SignedIn>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              id="org-switcher-trigger"
              className="group flex items-center gap-2 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border border-white/[0.12] bg-[#0c0c0e] hover:bg-[#141418] hover:border-white/[0.22] text-neutral-200 text-xs font-medium transition-all shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              aria-label="Switch or manage organization"
            >
              {organization?.imageUrl ? (
                <img
                  src={organization.imageUrl}
                  alt={organization.name}
                  className="w-4 h-4 rounded-sm object-cover"
                />
              ) : (
                <div className="w-4 h-4 rounded-sm bg-neutral-800 border border-white/10 flex items-center justify-center text-[9px] font-bold text-neutral-300">
                  {organization?.name ? (
                    organization.name.charAt(0).toUpperCase()
                  ) : (
                    <Building2 className="w-2.5 h-2.5 text-neutral-400" />
                  )}
                </div>
              )}

              <span className="truncate max-w-[110px] sm:max-w-[150px] text-neutral-100 font-semibold text-xs">
                {organization?.name || "Select Workspace"}
              </span>

              <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-200 transition-colors shrink-0" />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={6}
            className="w-72 sm:w-80 p-1.5 bg-[#09090c] border border-white/[0.12] shadow-[0_16px_45px_rgba(0,0,0,0.95)] rounded-xl text-neutral-100 divide-y divide-white/[0.08]"
          >
            {/* Current Active Workspace */}
            {organization && (
              <div className="p-2 pb-2.5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                  <span>Current Workspace</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-neutral-300 text-[9px]">
                    {membership?.role === "org:admin" ? "Admin" : "Member"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2 min-w-0">
                    {organization.imageUrl ? (
                      <img
                        src={organization.imageUrl}
                        alt={organization.name}
                        className="w-7 h-7 rounded-md object-cover border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-md bg-neutral-800 border border-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
                        {organization.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {organization.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 font-mono truncate">
                        {organization.slug ? `@${organization.slug}` : "Workspace"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPopoverOpen(false);
                      setIsManageModalOpen(true);
                    }}
                    className="shrink-0 p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors text-[11px] flex items-center gap-1 font-medium"
                    title="Manage Workspace"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Manage</span>
                  </button>
                </div>
              </div>
            )}

            {/* Organizations List */}
            {userMemberships?.data && userMemberships.data.length > 0 && (
              <div className="py-2">
                <div className="px-2 pb-1.5 text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase flex items-center justify-between">
                  <span>Workspaces</span>
                  <span className="text-[10px] text-neutral-500 font-normal">
                    {userMemberships.data.length} total
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                  {userMemberships.data.map((mem) => {
                    const isActive = mem.organization.id === organization?.id;
                    return (
                      <button
                        key={mem.id}
                        type="button"
                        onClick={() =>
                          handleSelectOrg(
                            mem.organization.id,
                            mem.organization.slug
                          )
                        }
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors text-left ${
                          isActive
                            ? "bg-white/[0.08] text-white font-semibold"
                            : "text-neutral-300 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {mem.organization.imageUrl ? (
                            <img
                              src={mem.organization.imageUrl}
                              alt={mem.organization.name}
                              className="w-5 h-5 rounded object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded bg-neutral-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-neutral-300 shrink-0">
                              {mem.organization.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="truncate">{mem.organization.name}</span>
                        </div>

                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions: Join & Create */}
            <div className="pt-1.5 space-y-1">
              <button
                type="button"
                id="join-org-button"
                onClick={() => {
                  setIsPopoverOpen(false);
                  setIsJoinModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:border-white/20 transition-all shrink-0">
                  <KeyRound className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-white">Join organization</span>
                  <span className="text-[10px] text-neutral-400">
                    Use a 6-digit invitation code
                  </span>
                </div>
              </button>

              <button
                type="button"
                id="create-org-button"
                onClick={() => {
                  setIsPopoverOpen(false);
                  setIsCreateModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors text-left group"
              >
                <div className="w-6 h-6 rounded-md bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:border-white/20 transition-all shrink-0">
                  <PlusCircle className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-white">Create organization</span>
                  <span className="text-[10px] text-neutral-400">
                    Establish new workspace
                  </span>
                </div>
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Join Organization Modal */}
        <JoinOrgDialog
          isOpen={isJoinModalOpen}
          onOpenChange={setIsJoinModalOpen}
        />

        {/* Create Organization Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-md p-0 bg-transparent border-0 shadow-none">
            <CustomCreateOrg onSuccess={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>

        {/* Manage Organization Profile Modal */}
        <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none overflow-hidden flex items-center justify-center">
            <OrganizationProfile
              routing="hash"
              appearance={{
                baseTheme: dark,
                elements: {
                  card: "bg-[#09090c] border border-white/10 shadow-[0_12px_45px_rgba(0,0,0,0.95)] rounded-2xl",
                },
              }}
            />
          </DialogContent>
        </Dialog>
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;
