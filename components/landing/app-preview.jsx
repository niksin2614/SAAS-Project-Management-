"use client";

import { useState } from "react";
import {
  LayoutGrid,
  BarChart3,
  MessageSquare,
  KeyRound,
  CheckCircle2,
  Clock,
  Flame,
  ShieldCheck,
  Send,
  Sparkles,
} from "lucide-react";

export default function AppPreview() {
  const [activeTab, setActiveTab] = useState("board");

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl border border-white/[0.12] bg-[#07070a] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden backdrop-blur-2xl">
      {/* Top Application Window Bar */}
      <div className="px-4 py-3 bg-[#0a0a0e] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        {/* Window controls & breadcrumbs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/70 border border-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/70 border border-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/70 border border-[#27c93f]" />
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/[0.1] text-[11px] font-mono text-neutral-400">
            <span className="text-neutral-500">syncd.app</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-300 font-semibold">acme-team</span>
            <span className="text-neutral-600">/</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              sprint-14
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#050507] p-1 rounded-xl border border-white/[0.08] text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("board")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-[11px] font-medium ${
              activeTab === "board"
                ? "bg-white text-black shadow-sm font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("telemetry")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-[11px] font-medium ${
              activeTab === "telemetry"
                ? "bg-white text-black shadow-sm font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Sprint Progress</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-[11px] font-medium ${
              activeTab === "chat"
                ? "bg-white text-black shadow-sm font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Team Chat</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("onboarding")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-[11px] font-medium ${
              activeTab === "onboarding"
                ? "bg-white text-black shadow-sm font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Join with Code</span>
          </button>
        </div>
      </div>

      {/* Main Preview Screen */}
      <div className="p-4 sm:p-6 min-h-[460px] bg-[#050508] text-neutral-100">
        {/* TAB 1: KANBAN SPRINT BOARD */}
        {activeTab === "board" && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            {/* Sprint Sub-header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                    Active Sprint
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                    ACTIVE
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                  Sprint 14: Mobile App & Website Redesign
                </h4>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Oct 14 – Oct 28 (14 Days Remaining)</span>
              </div>
            </div>

            {/* 4 Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-1">
              {/* Column 1: TODO */}
              <div className="bg-[#09090d] border border-white/[0.08] rounded-xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <span className="text-xs font-mono font-bold text-neutral-300">TO DO</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 px-1.5 py-0.5 bg-white/[0.04] rounded">
                    2
                  </span>
                </div>

                {/* Card 1 */}
                <div className="p-3 rounded-lg bg-black/60 border border-white/[0.08] hover:border-white/[0.22] transition-all cursor-pointer group shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1.5">
                    <span className="text-neutral-400 font-bold group-hover:text-white transition-colors">
                      SYNC-101
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                      HIGH
                    </span>
                  </div>
                  <p className="text-xs font-medium text-neutral-200 line-clamp-2 leading-relaxed">
                    Add user authentication and login screens
                  </p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1 font-mono">
                      <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
                        A
                      </span>
                      Alex
                    </span>
                    <span className="font-mono text-neutral-500">5 pts</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-3 rounded-lg bg-black/60 border border-white/[0.08] hover:border-white/[0.22] transition-all cursor-pointer group shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1.5">
                    <span className="text-neutral-400 font-bold group-hover:text-white transition-colors">
                      SYNC-105
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 font-semibold">
                      MEDIUM
                    </span>
                  </div>
                  <p className="text-xs font-medium text-neutral-200 line-clamp-2 leading-relaxed">
                    Update navigation menu and keyboard shortcuts
                  </p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1 font-mono">
                      <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
                        S
                      </span>
                      Sarah
                    </span>
                    <span className="font-mono text-neutral-500">3 pts</span>
                  </div>
                </div>
              </div>

              {/* Column 2: IN PROGRESS */}
              <div className="bg-[#09090d] border border-white/[0.08] rounded-xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span className="text-xs font-mono font-bold text-neutral-300">
                      IN PROGRESS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 px-1.5 py-0.5 bg-white/[0.04] rounded">
                    2
                  </span>
                </div>

                {/* Card 1 */}
                <div className="p-3 rounded-lg bg-black/80 border border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.08)] cursor-pointer group">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1.5">
                    <span className="text-sky-300 font-bold group-hover:text-white transition-colors">
                      SYNC-102
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300 font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-red-400" /> URGENT
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white line-clamp-2 leading-relaxed">
                    Design clean homepage layout and preview components
                  </p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1 font-mono">
                      <span className="w-4 h-4 rounded-full bg-sky-950 text-sky-200 border border-sky-700/50 flex items-center justify-center font-bold">
                        D
                      </span>
                      David
                    </span>
                    <span className="font-mono text-neutral-500">8 pts</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-3 rounded-lg bg-black/60 border border-white/[0.08] hover:border-white/[0.22] transition-all cursor-pointer group shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1.5">
                    <span className="text-neutral-400 font-bold group-hover:text-white transition-colors">
                      SYNC-104
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                      HIGH
                    </span>
                  </div>
                  <p className="text-xs font-medium text-neutral-200 line-clamp-2 leading-relaxed">
                    Setup project database and user access rules
                  </p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1 font-mono">
                      <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
                        E
                      </span>
                      Elena
                    </span>
                    <span className="font-mono text-neutral-500">5 pts</span>
                  </div>
                </div>
              </div>

              {/* Column 3: IN REVIEW */}
              <div className="bg-[#09090d] border border-white/[0.08] rounded-xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-mono font-bold text-neutral-300">
                      IN REVIEW
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 px-1.5 py-0.5 bg-white/[0.04] rounded">
                    1
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-black/60 border border-white/[0.08] hover:border-white/[0.22] transition-all cursor-pointer group shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1.5">
                    <span className="text-neutral-400 font-bold group-hover:text-white transition-colors">
                      SYNC-103
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300 font-semibold">
                      URGENT
                    </span>
                  </div>
                  <p className="text-xs font-medium text-neutral-200 line-clamp-2 leading-relaxed">
                    Create 6-digit invitation codes for new members
                  </p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1 font-mono">
                      <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold">
                        S
                      </span>
                      Sarah
                    </span>
                    <span className="font-mono text-neutral-500">5 pts</span>
                  </div>
                </div>
              </div>

              {/* Column 4: DONE */}
              <div className="bg-[#09090d] border border-white/[0.08] rounded-xl p-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono font-bold text-neutral-300">DONE</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 px-1.5 py-0.5 bg-white/[0.04] rounded">
                    1
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] opacity-75 hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1.5">
                    <span className="text-neutral-400 font-bold line-through">SYNC-100</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <p className="text-xs font-medium text-neutral-400 line-through line-clamp-2">
                    Setup project repository and core styling
                  </p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/[0.06] text-[10px] text-neutral-500">
                    <span className="font-mono">Elena</span>
                    <span className="font-mono text-emerald-400/80">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPRINT PROGRESS */}
        {activeTab === "telemetry" && (
          <div className="space-y-5 animate-in fade-in-50 duration-300 max-w-4xl mx-auto py-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#09090d] border border-white/[0.08]">
                <div className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                  Sprint Progress
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
                  75%
                </div>
                <div className="w-full bg-neutral-900 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full w-[75%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09090d] border border-white/[0.08]">
                <div className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                  Tasks Completed
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1">
                  6 of 8 Tasks
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                  2 tasks left in this sprint
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#09090d] border border-white/[0.08]">
                <div className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
                  Time Remaining
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mt-1">
                  14 Days
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                  Sprint ends on schedule
                </p>
              </div>
            </div>

            {/* Sprint Lifecycle Stages */}
            <div className="p-4 rounded-xl bg-[#09090d] border border-white/[0.08]">
              <div className="text-xs font-mono font-bold uppercase text-neutral-300 mb-3 flex items-center justify-between">
                <span>Sprint Stages</span>
                <span className="text-[10px] text-neutral-500">Tracked in SYNCD</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06]">
                  <div className="text-xs font-mono font-bold text-neutral-400">PLANNED</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Organize backlog</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 shadow-sm">
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVE
                  </div>
                  <div className="text-[10px] text-emerald-300/70 mt-0.5">In execution</div>
                </div>
                <div className="p-3 rounded-lg bg-black/60 border border-white/[0.06]">
                  <div className="text-xs font-mono font-bold text-neutral-400">COMPLETED</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">Sprint finished</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TEAM CHAT */}
        {activeTab === "chat" && (
          <div className="max-w-3xl mx-auto rounded-xl bg-[#09090d] border border-white/[0.08] overflow-hidden flex flex-col h-[380px] animate-in fade-in-50 duration-300">
            <div className="px-4 py-2.5 bg-black/60 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">#general-team-chat</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Workspace Chat</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-neutral-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Alex Morgan</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">
                      Admin
                    </span>
                    <span className="text-[10px] text-neutral-500">10:14 AM</span>
                  </div>
                  <p className="text-neutral-300 mt-0.5 leading-relaxed">
                    Sprint 14 has started. Let&apos;s focus on the priority tasks first.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-sky-900 text-sky-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                  S
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Sarah Chen</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 bg-white/10 text-neutral-300 rounded">
                      Member
                    </span>
                    <span className="text-[10px] text-neutral-500">10:17 AM</span>
                  </div>
                  <p className="text-neutral-300 mt-0.5 leading-relaxed">
                    The new invite code is ready. Teammates can now join with 6-digit codes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-neutral-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  D
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">David K.</span>
                    <span className="text-[9px] font-mono px-1 py-0.2 bg-white/10 text-neutral-300 rounded">
                      Member
                    </span>
                    <span className="text-[10px] text-neutral-500">10:22 AM</span>
                  </div>
                  <p className="text-neutral-300 mt-0.5 leading-relaxed">
                    The task board drag-and-drop is working smoothly on my end.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-black/80 border-t border-white/[0.08] flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="Write a message to your team..."
                className="flex-1 bg-[#050507] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-neutral-400 font-mono"
              />
              <button
                type="button"
                className="h-8 px-3 rounded-lg bg-white text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-neutral-200 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: 6-DIGIT JOIN CODE */}
        {activeTab === "onboarding" && (
          <div className="max-w-md mx-auto py-6 animate-in fade-in-50 duration-300 space-y-4">
            <div className="p-5 rounded-2xl bg-[#09090c] border border-white/[0.12] shadow-2xl text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-white mx-auto shadow-md">
                <KeyRound className="w-5 h-5 text-neutral-200" />
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight">
                Organization Invite Code
              </h4>
              <p className="text-xs text-neutral-400">
                Share this 6-digit code with teammates so they can join your workspace.
              </p>

              <div className="p-3 rounded-xl bg-black border border-white/[0.18] font-mono font-bold text-2xl tracking-[0.25em] text-white shadow-inner">
                SYNCD-8K9P2X
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.08] text-[11px] text-neutral-400 text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Teammates enter this code to join your workspace and start collaborating right away.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Footer Strip */}
      <div className="px-5 py-2.5 bg-[#09090d] border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-neutral-500">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          SYNCD Project Management Platform
        </span>
        <span className="hidden sm:inline text-neutral-400">
          Interactive Application Preview
        </span>
      </div>
    </div>
  );
}
