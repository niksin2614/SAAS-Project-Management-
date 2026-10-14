"use client";

import { useState } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import IssueDetailsDialog from "./issue-details-dialog";
import UserAvatar from "./user-avatar";
import { useRouter } from "next/navigation";

const priorityConfig = {
  LOW: {
    label: "Low",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-sky-400",
    text: "text-sky-300",
    border: "border-sky-500/30",
  },
  HIGH: {
    label: "High",
    dot: "bg-amber-400",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  URGENT: {
    label: "Urgent",
    dot: "bg-rose-400",
    text: "text-rose-300",
    border: "border-rose-500/30",
  },
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const onDeleteHandler = (...params) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params) => {
    router.refresh();
    onUpdate(...params);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  const pConfig = priorityConfig[issue.priority] || priorityConfig.MEDIUM;

  return (
    <>
      <Card
        className="cursor-pointer bg-[#0b0b0e] border border-white/[0.08] hover:border-white/[0.22] hover:bg-[#101015] transition-all duration-150 rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.5)] group"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader className="p-3.5 pb-2">
          {/* Priority and Status badges */}
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.04] border ${pConfig.border} ${pConfig.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot}`} />
              {pConfig.label}
            </span>

            {showStatus && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-neutral-300">
                {issue.status}
              </span>
            )}
          </div>

          <CardTitle className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-white leading-snug line-clamp-2">
            {issue.title}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex items-center justify-between p-3.5 pt-2 border-t border-white/[0.06]">
          <UserAvatar user={issue.assignee} size="sm" />
          <span className="text-[10px] font-mono text-neutral-400">
            {created}
          </span>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={pConfig.border}
        />
      )}
    </>
  );
}
