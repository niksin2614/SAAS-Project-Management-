"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import OrgChat from "@/app/(main)/organization/[orgId]/_components/org-chat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ChatWidget({ orgId, orgName, buttonVariant = "floating" }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!orgId) return null;

  return (
    <>
      {buttonVariant === "floating" && (
        <div className="fixed bottom-5 right-5 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            size="sm"
            className="h-10 px-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-blue-500/30 border border-blue-400/30 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full ring-2 ring-slate-950 animate-pulse" />
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
          className="h-8 sm:h-9 px-3 rounded-lg border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
          <span>Team Chat</span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[650px] max-h-[85vh] bg-slate-950 border border-slate-800 p-0 overflow-hidden text-slate-100 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
          <OrgChat orgId={orgId} orgName={orgName} />
        </DialogContent>
      </Dialog>
    </>
  );
}
