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
import { ExternalLink } from "lucide-react";
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
  borderCol = "",
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
      <DialogContent className="max-w-xl sm:max-w-2xl bg-slate-950 border-slate-800 p-6 sm:p-8 text-slate-100 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="flex justify-between items-center gap-4">
            <DialogTitle className="text-2xl sm:text-3xl font-bold leading-tight text-white">
              {issue.title}
            </DialogTitle>
            {isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoToProject}
                title="Go to Project"
                className="hover:bg-slate-800"
              >
                <ExternalLink className="h-5 w-5" />
              </Button>
            )}
          </div>
        </DialogHeader>
        {(updateLoading || deleteLoading) && (
          <BarLoader width={"100%"} color="#36d7b7" />
        )}
        <div className="space-y-6 pt-2">
          <div className="flex items-center space-x-3">
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={!isAdmin || updateLoading}
            >
              <SelectTrigger className={`h-11 text-base bg-slate-900 border-slate-800 text-slate-100 ${!isAdmin ? "opacity-70 cursor-not-allowed" : ""}`}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                {statuses.map((option) => (
                  <SelectItem key={option.key} value={option.key} className="text-base py-2">
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={priority}
              onValueChange={handlePriorityChange}
              disabled={!canChange || updateLoading}
            >
              <SelectTrigger className={`h-11 text-base bg-slate-900 border ${borderCol} rounded-md text-slate-100 ${!canChange ? "opacity-70 cursor-not-allowed" : ""}`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-100">
                {priorityOptions.map((option) => (
                  <SelectItem key={option} value={option} className="text-base py-2">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-200 mb-2">Description</h4>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-base text-slate-200">
              <MDEditor.Markdown
                source={issue.description ? issue.description : "--"}
              />
            </div>
          </div>

          <div className="flex justify-between gap-6 pt-2 border-t border-slate-800/80">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-slate-400">Assignee</h4>
              <UserAvatar user={issue.assignee} size="md" />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-slate-400">Reporter</h4>
              <UserAvatar user={issue.reporter} size="md" />
            </div>
          </div>

          {canChange && (
            <div className="pt-2">
              <Button
                onClick={handleDelete}
                disabled={deleteLoading}
                variant="destructive"
                className="font-bold h-11 px-5 text-sm shadow-md"
              >
                {deleteLoading ? "Deleting..." : "Delete Issue"}
              </Button>
            </div>
          )}
          {(deleteError || updateError) && (
            <p className="text-red-400 text-sm font-medium">
              {deleteError?.message || updateError?.message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
