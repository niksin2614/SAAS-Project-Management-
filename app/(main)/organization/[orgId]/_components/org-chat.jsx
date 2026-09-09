"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, useOrganization } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isToday, isYesterday } from "date-fns";
import {
  Send,
  Trash2,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
  Smile,
  Sparkles,
  Hash,
  Loader2,
  Search,
  Zap,
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
    if (orgId) {
      loadMessages(true);
      const interval = setInterval(() => {
        loadMessages(false);
      }, 3000);

      return () => clearInterval(interval);
    }
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
    <div className="flex flex-col h-full min-h-[500px] max-h-[720px] w-full max-w-5xl mx-auto bg-gradient-to-b from-[#0b0f19] via-[#0d1322] to-[#080b12] text-slate-100 rounded-2xl sm:rounded-3xl overflow-hidden border border-indigo-500/20 shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 font-sans">
      {/* Modern Header */}
      <div className="px-6 py-4.5 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-slate-950 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-indigo-400 opacity-80" />
                {orgName || "Team"} Hub
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time collaboration & sprint discussions for all members
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* In-stream Search */}
          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat..."
              className="bg-slate-900/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 w-44 transition-all"
            />
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
              isAdmin
                ? "bg-purple-950/60 border-purple-700/80 text-purple-200 shadow-sm"
                : "bg-slate-900 border-slate-700 text-slate-300"
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <UserIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Member</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Message Feed Stream */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#334155 transparent" }}
      >
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-sm font-semibold">Connecting live sync channel...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-900/40 via-blue-900/30 to-purple-900/20 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-2xl ring-1 ring-white/10">
              <Sparkles className="w-9 h-9 text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
              Welcome to #{orgName || "Team"} Channel!
            </h3>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed font-medium mb-6">
              Start the conversation! Coordinate tasks, share updates, or announce sprint goals.
            </p>

            {/* Quick Prompt Starters */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {SMART_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.text)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all transform hover:scale-105 shadow-md flex items-center gap-1.5"
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
                className={`group relative flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 ${
                  isMine
                    ? "bg-gradient-to-r from-blue-950/35 via-indigo-950/20 to-transparent border-l-3 border-blue-500 hover:bg-slate-900/50 shadow-sm"
                    : "hover:bg-slate-900/40 border-l-3 border-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0 mt-0.5">
                  <Avatar className="w-11 h-11 rounded-2xl ring-2 ring-slate-800 shadow-md">
                    <AvatarImage src={msg.sender?.imageUrl} alt={msg.sender?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-950 to-slate-900 text-sm font-bold text-slate-200">
                      {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isMsgAdmin && (
                    <span
                      title="Admin"
                      className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-slate-950"
                    >
                      <ShieldCheck className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>

                {/* Message Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-extrabold text-white hover:underline cursor-pointer">
                      {isMine ? "You" : msg.sender?.name || "Member"}
                    </span>

                    {isMsgAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md bg-purple-950 text-purple-300 border border-purple-700 text-[10px] font-black uppercase tracking-wider">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60 text-[10px] font-medium">
                        Member
                      </span>
                    )}

                    <span className="text-xs text-slate-400 font-medium">
                      {formatMessageDate(msg.createdAt)}
                    </span>
                  </div>

                  <div className="text-[15px] text-slate-100 leading-relaxed font-normal whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>

                  {/* Interactive Emoji Reaction Counters */}
                  {Object.keys(msgReactions).length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {Object.entries(msgReactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(msg.id, emoji)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 hover:border-indigo-500 hover:scale-105 transition-all shadow-sm"
                        >
                          <span>{emoji}</span>
                          <span className="text-[11px] font-bold text-indigo-400">{count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Hover Quick Action Toolbar */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-3 flex items-center gap-1 bg-slate-900/95 border border-slate-700 rounded-xl p-1 shadow-2xl backdrop-blur-md z-10">
                  {["👍", "🔥", "🚀", "❤️"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReact(msg.id, emoji)}
                      title={`React ${emoji}`}
                      className="p-1 rounded-lg hover:bg-slate-800 text-xs transition-transform hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      title="Delete message"
                      className="p-1.5 rounded-lg hover:bg-red-950 text-slate-400 hover:text-red-400 transition-colors ml-1 border-l border-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Modern Composer */}
      <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-2xl">
        {/* Quick Smart Agile Chips */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 text-xs" style={{ scrollbarWidth: "none" }}>
          <span className="text-slate-400 font-bold flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Quick Sync:
          </span>
          {SMART_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(chip.text)}
              className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-950/40 text-slate-300 hover:text-white font-medium whitespace-nowrap transition-all shadow-sm"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message #${orgName || "team"}... (Enter to send)`}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3.5 text-slate-100 placeholder:text-slate-500 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
              disabled={isSending}
              maxLength={1000}
            />
          </div>

          <Button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Send</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
