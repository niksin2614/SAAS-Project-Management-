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
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 px-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-2xl shadow-blue-500/40 border border-blue-400/30 flex items-center gap-2.5 transition-all transform hover:scale-105"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-slate-950 animate-pulse" />
            </div>
            <span>Team Chat</span>
          </Button>
        </div>
      )}

      {buttonVariant === "button" && (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4 text-blue-400" />
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
