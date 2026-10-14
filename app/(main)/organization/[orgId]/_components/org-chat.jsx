"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isToday, isYesterday } from "date-fns";
import {
  Send,
  Trash2,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
  Sparkles,
  Hash,
  Loader2,
  Search,
} from "lucide-react";
import {
  getOrganizationMessages,
  sendOrganizationMessage,
  deleteChatMessage,
} from "@/actions/chat";
import { toast } from "sonner";

// Smart AI / Agile Quick Prompts
const SMART_CHIPS = [
  { label: "🚀 Sprint on track", text: "🚀 Update: Sprint tasks are progressing on schedule!" },
  { label: "⚠️ Found a blocker", text: "⚠️ Blocker Alert: Need assistance on an issue." },
  { label: "👀 Reviewing PR", text: "👀 Currently reviewing the latest frontend changes." },
  { label: "✅ Task Completed", text: "✅ Just moved my assigned task to Done!" },
  { label: "🎯 Ready for next task", text: "🎯 Ready for the next sprint ticket." },
];

export default function OrgChat({ orgId, orgName }) {
  const { user } = useUser();
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [reactions, setReactions] = useState({});

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const loadMessages = async (isInitial = false) => {
    try {
      const data = await getOrganizationMessages(orgId);
      setMessages(data || []);
      if (isInitial) {
        setIsLoading(false);
        setTimeout(() => scrollToBottom(false), 80);
      }
    } catch (err) {
      console.error("Error loading chat messages:", err);
      if (isInitial) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orgId && orgId !== "[orgId]") {
      loadMessages(true);
      const interval = setInterval(() => {
        loadMessages(false);
      }, 3000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages.length, isLoading]);

  const handleSendMessage = async (customText = null) => {
    const text = (customText || inputText).trim();
    if (!text || isSending) return;

    setIsSending(true);
    setInputText("");

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      content: text,
      organizationId: orgId,
      senderRole: isAdmin ? "org:admin" : "org:member",
      createdAt: new Date().toISOString(),
      sender: {
        id: user?.id,
        clerkUserId: user?.id,
        name: user?.fullName || user?.firstName || "You",
        imageUrl: user?.imageUrl,
        email: user?.primaryEmailAddress?.emailAddress,
      },
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollToBottom(true), 50);

    try {
      const created = await sendOrganizationMessage(orgId, text);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? created : msg))
      );
    } catch (err) {
      toast.error(err.message || "Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setInputText(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteChatMessage(msgId);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      toast.success("Message deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete message");
    }
  };

  const handleReact = (msgId, emoji) => {
    setReactions((prev) => {
      const msgReactions = prev[msgId] || {};
      const currentCount = msgReactions[emoji] || 0;
      return {
        ...prev,
        [msgId]: {
          ...msgReactions,
          [emoji]: currentCount + 1,
        },
      };
    });
  };

  const formatMessageDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    }
    return format(date, "MMM d, h:mm a");
  };

  const filteredMessages = messages.filter((m) =>
    searchQuery ? m.content.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="flex flex-col h-full min-h-[500px] max-h-[720px] w-full max-w-5xl mx-auto bg-[#08080a] text-neutral-100 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.1] shadow-[0_25px_70px_rgba(0,0,0,0.9)] font-sans">
      {/* Cinematic Header */}
      <div className="px-5 py-3.5 bg-black/80 border-b border-white/[0.08] backdrop-blur-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/[0.14] flex items-center justify-center text-white shadow-md">
              <MessageSquare className="w-5 h-5 text-neutral-200" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-black flex items-center justify-center" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-neutral-500" />
                {orgName || "Team"} Channel
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Workspace collaboration & sprint coordination
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter messages..."
              className="bg-[#050507] border border-white/[0.1] rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-white/30 w-40 transition-all font-mono"
            />
          </div>

          <div
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-xs font-mono font-medium ${
              isAdmin
                ? "bg-white/[0.08] border-white/20 text-neutral-200"
                : "bg-white/[0.04] border-white/10 text-neutral-400"
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-200" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                <span>Member</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Message Feed Stream */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-5 py-5 space-y-3"
      >
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="text-xs font-mono">Connecting live channel...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-black border border-white/[0.12] flex items-center justify-center mb-3 shadow-md">
              <Sparkles className="w-7 h-7 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">
              #{orgName || "Team"} Discussion Channel
            </h3>
            <p className="text-neutral-400 text-xs max-w-sm leading-relaxed mb-6">
              Start the discussion! Share sprint updates, coordinate reviews, or flag blockers.
            </p>

            {/* Quick Prompt Starters */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {SMART_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.text)}
                  className="px-3 py-1.5 rounded-xl bg-[#0c0c0e] border border-white/[0.1] hover:border-white/30 text-xs font-medium text-neutral-300 hover:text-white transition-all shadow-sm"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMine = msg.sender?.clerkUserId === user?.id;
            const isMsgAdmin = msg.senderRole === "org:admin";
            const canDelete = isMine || isAdmin;
            const msgReactions = reactions[msg.id] || {};

            return (
              <div
                key={msg.id}
                className={`group relative flex items-start gap-3.5 p-3 rounded-xl transition-all duration-150 ${
                  isMine
                    ? "bg-white/[0.03] border-l-2 border-white/60"
                    : "hover:bg-white/[0.02] border-l-2 border-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <Avatar className="w-9 h-9 rounded-xl border border-white/10 shadow-sm">
                    <AvatarImage src={msg.sender?.imageUrl} alt={msg.sender?.name || "User"} />
                    <AvatarFallback className="bg-[#18181c] text-xs font-bold text-neutral-200">
                      {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isMsgAdmin && (
                    <span
                      title="Admin"
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-neutral-200 text-black rounded-full flex items-center justify-center ring-2 ring-black"
                    >
                      <ShieldCheck className="w-2 h-2" />
                    </span>
                  )}
                </div>

                {/* Message Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-bold text-white">
                      {isMine ? "You" : msg.sender?.name || "Member"}
                    </span>

                    {isMsgAdmin ? (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-white/[0.08] text-neutral-300 border border-white/10 text-[9px] font-mono uppercase tracking-wider">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-white/[0.04] text-neutral-500 border border-white/[0.08] text-[9px] font-mono">
                        Member
                      </span>
                    )}

                    <span className="text-[10px] font-mono text-neutral-500">
                      {formatMessageDate(msg.createdAt)}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>

                  {/* Reaction counters */}
                  {Object.keys(msgReactions).length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      {Object.entries(msgReactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(msg.id, emoji)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#0e0e12] border border-white/10 text-xs text-neutral-300 hover:border-white/30 transition-all shadow-sm"
                        >
                          <span>{emoji}</span>
                          <span className="text-[10px] font-mono font-bold text-neutral-200">{count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover Quick Action Toolbar */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-2 flex items-center gap-1 bg-[#0c0c0e] border border-white/15 rounded-lg p-1 shadow-xl backdrop-blur-md z-10">
                  {["👍", "🔥", "🚀", "❤️"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReact(msg.id, emoji)}
                      title={`React ${emoji}`}
                      className="p-1 rounded hover:bg-white/10 text-xs transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      title="Delete message"
                      className="p-1 rounded hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 transition-colors ml-1 border-l border-white/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="p-3.5 bg-black/80 border-t border-white/[0.08] backdrop-blur-xl">
        {/* Quick Smart Chips */}
        <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1 text-xs" style={{ scrollbarWidth: "none" }}>
          <span className="text-neutral-500 font-mono text-[11px] flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3 h-3 text-neutral-400" /> Quick Sync:
          </span>
          {SMART_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(chip.text)}
              className="px-2.5 py-1 rounded-lg bg-[#0c0c0e] border border-white/[0.08] hover:border-white/25 text-neutral-400 hover:text-white font-medium whitespace-nowrap transition-all text-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative flex items-center gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${orgName || "team"}... (Enter to send)`}
              className="w-full bg-[#050507] border border-white/[0.12] rounded-xl px-4 py-3 text-neutral-100 placeholder:text-neutral-600 text-xs sm:text-sm font-medium focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all shadow-inner"
              disabled={isSending}
              maxLength={1000}
            />
          </div>

          <Button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="h-11 px-5 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-all disabled:opacity-40"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <>
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
