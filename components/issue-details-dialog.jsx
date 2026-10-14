"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-avatar";
import useFetch from "@/hooks/use-fetch";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarLoader } from "react-spinners";
import { Trash2, ArrowUpRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import statuses from "@/data/status";
import { deleteIssue, updateIssue } from "@/actions/issues";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function IssueDetailsDialog({
  isOpen,
  onClose,
  issue,
  onDelete = () => {},
  onUpdate = () => {},
}) {
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);
  const { user } = useUser();
  const { membership } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();

  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue);

  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssueFn(issue.id);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    updateIssueFn(issue.id, { status: newStatus, priority });
  };

  const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority);
    updateIssueFn(issue.id, { status, priority: newPriority });
  };

  useEffect(() => {
    if (deleted) {
      onClose();
      onDelete();
    }
    if (updated) {
      onUpdate(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted, updated, deleteLoading, updateLoading]);

  const isAdmin = membership?.role === "org:admin";
  const canChange =
    user?.id === issue?.reporter?.clerkUserId || isAdmin;

  const handleGoToProject = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };

  const isProjectPage = !pathname.startsWith("/project/");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl sm:max-w-2xl bg-[#09090c] border border-white/[0.12] p-6 sm:p-7 text-neutral-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
        <DialogHeader className="pb-2">
          <div className="flex justify-between items-start gap-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold leading-snug text-white tracking-tight">
              {issue.title}
            </DialogTitle>
            {isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoToProject}
                title="Go to Project"
                className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg shrink-0"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {(updateLoading || deleteLoading) && (
          <BarLoader width={"100%"} color="#ffffff" />
        )}

        <div className="space-y-5 pt-2">
          {/* Controls: Status & Priority Select */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Status
              </label>
              <Select
                value={status}
                onValueChange={handleStatusChange}
                disabled={!isAdmin || updateLoading}
              >
                <SelectTrigger
                  className={`h-10 text-xs sm:text-sm bg-[#050507] border-white/[0.12] rounded-xl text-neutral-100 ${
                    !isAdmin ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c0c0e] border border-white/10 text-neutral-100 shadow-xl">
                  {statuses.map((option) => (
                    <SelectItem key={option.key} value={option.key} className="text-xs sm:text-sm py-2">
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Priority
              </label>
              <Select
                value={priority}
                onValueChange={handlePriorityChange}
                disabled={!canChange || updateLoading}
              >
                <SelectTrigger
                  className={`h-10 text-xs sm:text-sm bg-[#050507] border-white/[0.12] rounded-xl text-neutral-100 ${
                    !canChange ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-[#0c0c0e] border border-white/10 text-neutral-100 shadow-xl">
                  {priorityOptions.map((option) => (
                    <SelectItem key={option} value={option} className="text-xs sm:text-sm py-2">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Description
            </h4>
            <div className="bg-[#050507] border border-white/[0.08] rounded-xl p-4 text-xs sm:text-sm text-neutral-200 min-h-[90px] leading-relaxed">
              <MDEditor.Markdown
                source={issue.description ? issue.description : "*No description provided.*"}
              />
            </div>
          </div>

          {/* People: Assignee & Reporter */}
          <div className="grid grid-cols-2 gap-4 p-3.5 rounded-xl bg-black/60 border border-white/[0.08]">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Assignee
              </span>
              <UserAvatar user={issue.assignee} size="sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                Reporter
              </span>
              <UserAvatar user={issue.reporter} size="sm" />
            </div>
          </div>

          {/* Delete Action if authorized */}
          {canChange && (
            <div className="pt-2 flex justify-end">
              <Button
                onClick={handleDelete}
                disabled={deleteLoading}
                variant="ghost"
                size="sm"
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg h-9 px-3.5 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleteLoading ? "Deleting..." : "Delete Issue"}</span>
              </Button>
            </div>
          )}

          {(deleteError || updateError) && (
            <p className="text-rose-400 text-xs font-medium">
              {deleteError?.message || updateError?.message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
