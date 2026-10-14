"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import OrgChat from "@/app/(main)/organization/[orgId]/_components/org-chat";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ChatWidget({ orgId, orgName, buttonVariant = "floating" }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!orgId) return null;

  return (
    <>
      {buttonVariant === "floating" && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setIsOpen(true)}
            size="sm"
            className="h-10 px-4 rounded-full bg-[#0c0c0f] hover:bg-[#141418] text-white font-semibold text-xs sm:text-sm shadow-[0_4px_25px_rgba(0,0,0,0.8)] border border-white/20 hover:border-white/40 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-neutral-200" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-black animate-pulse" />
            </div>
            <span>Team Chat</span>
          </Button>
        </div>
      )}

      {buttonVariant === "button" && (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="h-8 sm:h-9 px-3 rounded-lg border-white/[0.12] bg-[#0c0c0e] hover:bg-[#141418] hover:border-white/[0.22] text-neutral-200 text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
        >
          <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
          <span>Team Chat</span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[650px] max-h-[85vh] bg-[#09090c] border border-white/[0.12] p-0 overflow-hidden text-neutral-100 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          <DialogTitle className="sr-only">Team Workspace Chat</DialogTitle>
          <DialogDescription className="sr-only">Real-time team chat channel</DialogDescription>
          <OrgChat orgId={orgId} orgName={orgName} />
        </DialogContent>
      </Dialog>
    </>
  );
}
