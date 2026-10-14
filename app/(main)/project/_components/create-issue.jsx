"use client";

import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useFetch from "@/hooks/use-fetch";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import { issueSchema } from "@/app/lib/validators";
import {
  User,
  AlertCircle,
  CornerDownLeft,
  Eye,
  Edit3,
  Zap,
  Bug,
  CheckSquare,
} from "lucide-react";

const priorities = [
  {
    value: "LOW",
    label: "Low",
    dot: "bg-emerald-400",
    activeClass: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    dot: "bg-sky-400",
    activeClass: "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm",
  },
  {
    value: "HIGH",
    label: "High",
    dot: "bg-amber-400",
    activeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm",
  },
  {
    value: "URGENT",
    label: "Urgent",
    dot: "bg-rose-400",
    activeClass: "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm",
  },
];

const templates = {
  story: `### 🎯 Goal\nAs a user, I want to [action] so that [benefit].\n\n### ✅ Acceptance Criteria\n- [ ] Criteria 1\n- [ ] Criteria 2`,
  bug: `### 🐞 Bug Description\nA clear description of what the bug is.\n\n### 🔄 Steps to Reproduce\n1. Go to '...'\n2. Click on '...'\n\n### ⚠️ Expected vs Actual\n- **Expected:** ...\n- **Actual:** ...`,
  checklist: `### 📋 Action Items\n- [ ] Initial research & setup\n- [ ] Core implementation\n- [ ] Unit & integration tests\n- [ ] Documentation update`,
};

export default function IssueCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) {
  const [descTab, setDescTab] = useState("write");

  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  const selectedPriority = watch("priority");
  const descriptionValue = watch("description");

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, orgId]);

  const onSubmit = async (data) => {
    await createIssueFn(projectId, {
      ...data,
      status,
      sprintId,
    });
  };

  useEffect(() => {
    if (newIssue) {
      reset();
      setDescTab("write");
      onClose();
      onIssueCreated(newIssue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newIssue, createIssueLoading]);

  // Support Ctrl+Enter / Cmd+Enter to create
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const applyTemplate = (key) => {
    const tmpl = templates[key];
    if (tmpl) {
      setValue("description", tmpl, { shouldDirty: true });
      setDescTab("write");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onKeyDown={handleKeyDown}
        className="max-w-2xl bg-[#09090c] border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.95)] rounded-2xl p-0 text-neutral-100 overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-white/[0.08] bg-black/60 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-neutral-200 text-xs font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
              <span>{status || "TODO"}</span>
            </div>
            <span className="text-neutral-600">&bull;</span>
            <DialogTitle className="text-sm font-semibold text-neutral-200">
              Create New Issue
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Fill in issue title, description, priority, and assignee.
          </DialogDescription>
        </DialogHeader>

        {usersLoading && <BarLoader width={"100%"} color="#ffffff" />}

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Issue Title Input */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Issue Title <span className="text-rose-400">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="What needs to be accomplished?"
              className="w-full h-11 px-3.5 bg-[#050507] border border-white/[0.12] rounded-xl text-sm font-semibold text-white placeholder:text-neutral-600 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all shadow-inner"
              autoFocus
            />
            {errors.title && (
              <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* 2-Column: Assignee & Priority Control */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assignee Picker */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                Assignee
              </label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-10 bg-[#050507] border-white/[0.12] rounded-xl px-3 text-xs text-neutral-200 focus:border-white/40 shadow-inner">
                      <SelectValue placeholder="Assign to team member" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0c0c0e] border border-white/10 text-neutral-200 rounded-xl shadow-xl">
                      {users?.map((u) => (
                        <SelectItem key={u.id} value={u.id} className="py-2 text-xs focus:bg-white/5 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5 border border-white/10">
                              <AvatarImage src={u.imageUrl} />
                              <AvatarFallback className="text-[10px] bg-neutral-800 text-white font-bold">
                                {u.name ? u.name[0]?.toUpperCase() : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span>{u.name || "User"}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Interactive Priority Selector (Segmented Toggle) */}
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#050507] border border-white/[0.1] rounded-xl">
                {priorities.map((p) => {
                  const isActive = selectedPriority === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setValue("priority", p.value, { shouldDirty: true })}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? p.activeClass
                          : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description Section with Quick Templates & Write/Preview Tabs */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-0.5 bg-[#050507] border border-white/[0.1] rounded-lg">
                <button
                  type="button"
                  onClick={() => setDescTab("write")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    descTab === "write"
                      ? "bg-white/[0.1] text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setDescTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    descTab === "preview"
                      ? "bg-white/[0.1] text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
              </div>

              {/* 1-Click Description Templates */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                  Templates:
                </span>
                <button
                  type="button"
                  onClick={() => applyTemplate("story")}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#050507] border border-white/[0.1] hover:border-white/25 text-neutral-300 text-[11px] font-medium transition-colors"
                  title="Insert User Story template"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  Story
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("bug")}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#050507] border border-white/[0.1] hover:border-white/25 text-neutral-300 text-[11px] font-medium transition-colors"
                  title="Insert Bug Report template"
                >
                  <Bug className="w-3 h-3 text-rose-400" />
                  Bug
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate("checklist")}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#050507] border border-white/[0.1] hover:border-white/25 text-neutral-300 text-[11px] font-medium transition-colors"
                  title="Insert Checklist template"
                >
                  <CheckSquare className="w-3 h-3 text-sky-400" />
                  Checklist
                </button>
              </div>
            </div>

            {/* Description Textarea / Preview Box */}
            {descTab === "write" ? (
              <textarea
                {...register("description")}
                placeholder="Add context, acceptance criteria, or technical details..."
                rows={5}
                className="w-full p-3.5 bg-[#050507] border border-white/[0.12] rounded-xl text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all font-mono resize-y shadow-inner leading-relaxed"
              />
            ) : (
              <div className="w-full min-h-[120px] p-3.5 bg-black/50 border border-white/[0.08] rounded-xl text-xs sm:text-sm text-neutral-200">
                {descriptionValue?.trim() ? (
                  <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-neutral-300">
                    {descriptionValue}
                  </div>
                ) : (
                  <p className="text-neutral-500 italic text-xs">Nothing to preview yet.</p>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error.message}</span>
            </div>
          )}

          {/* Action Buttons & Shortcut Bar */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-black border border-white/10 text-neutral-300">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black border border-white/10 text-neutral-300 flex items-center gap-0.5">
                <CornerDownLeft className="w-2.5 h-2.5" /> Enter
              </kbd>
              <span className="ml-1 text-neutral-400">to save</span>
            </div>

            <div className="flex items-center gap-2.5 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createIssueLoading}
                className="h-10 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-md active:scale-95 transition-all disabled:opacity-40"
              >
                {createIssueLoading ? "Creating..." : "Create Issue"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
