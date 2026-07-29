import { useEffect, useState, useRef } from "react";
import {
  getChatSessions,
  createChatSession,
  getChatMessages,
  sendChatMessage,
} from "../../../services/ai.service";
import {
  Bot,
  User,
  Plus,
  Send,
  Sparkles,
  Loader2,
  X,
  MessageSquare,
  ChevronDown,
  Copy,
  Check,
  CornerDownLeft,
  Command,
} from "lucide-react";

interface PersistentAIAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  floatingMode?: boolean; // True when showing inside a drawer/modal on mobile
}

export default function PersistentAIAssistant({
  isOpen = true,
  onClose,
  floatingMode = false,
}: PersistentAIAssistantProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(() => {
    const saved = localStorage.getItem("active_chat_session_id");
    return saved ? parseInt(saved) : null;
  });
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [showSessionsDropdown, setShowSessionsDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadSessions = async (autoSelect = false) => {
    try {
      const data = await getChatSessions();
      setSessions(data || []);
      if (data && data.length > 0) {
        if (activeSessionId === null || autoSelect) {
          const firstId = data[0].id ?? data[0].Id;
          setActiveSessionId(firstId);
          localStorage.setItem("active_chat_session_id", String(firstId));
        }
      }
    } catch (err) {
      console.error("Error loading chat sessions:", err);
    }
  };

  const loadMessages = async (sessionId: number) => {
    setIsLoadingMessages(true);
    try {
      const data = await getChatMessages(sessionId);
      setMessages(data || []);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (activeSessionId !== null) {
      loadMessages(activeSessionId);
      localStorage.setItem("active_chat_session_id", String(activeSessionId));
    } else {
      setMessages([]);
    }
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;
    setIsCreatingSession(true);
    try {
      const newSession = await createChatSession(newSessionTitle);
      await loadSessions(false);
      setActiveSessionId(newSession.id ?? newSession.Id);
      setNewSessionTitle("");
      setShowSessionsDropdown(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    let sessionId = activeSessionId;

    // Auto-create a session if none is active
    if (sessionId === null) {
      setIsSending(true);
      try {
        const fallbackTitle =
          inputText.trim().substring(0, 24) || "New AI Consulting";
        const newSession = await createChatSession(fallbackTitle);
        await loadSessions(false);
        sessionId = newSession.id ?? newSession.Id;
        setActiveSessionId(newSession.id ?? newSession.Id);
      } catch (err) {
        console.error("Auto-session creation failed:", err);
      }
    }

    if (sessionId === null) return;

    const userMsgText = inputText.trim();
    setInputText("");
    setIsSending(true);

    // Optimistically push User message to the view
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMsgText,
        createdOn: new Date().toISOString(),
      },
    ]);

    try {
      await sendChatMessage(sessionId, userMsgText);
      await loadMessages(sessionId);
    } catch (err) {
      console.error("Error sending chat message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPromptClick = async (prompt: string) => {
    setInputText(prompt);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    "Draft a professional summary focusing on System Architecture.",
    "Give me mock interview questions for a Senior Developer.",
    "Rewrite my experience bullet points into STAR format.",
    "What missing keywords would optimize my resume for ATS?",
  ];

  const activeSession = sessions.find((s) => (s.id ?? s.Id) === activeSessionId);

  if (!isOpen && !floatingMode) return null;

  return (
    <aside
      className={`w-80 border-l border-ascend-border bg-ascend-sidebar flex flex-col h-screen sticky top-0 no-print z-20 shrink-0 ${
        floatingMode ? "w-full border-l-0" : ""
      }`}
    >
      {/* Assistant Header */}
      <div className="p-4 border-b border-ascend-border flex items-center justify-between bg-ascend-sidebar/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2.5 relative">
          <div className="w-8 h-8 rounded-button bg-ascend-ai/15 border border-ascend-ai/30 flex items-center justify-center text-ascend-ai shadow-[0_0_15px_rgba(124,58,237,0.1)]">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <button
              onClick={() => setShowSessionsDropdown(!showSessionsDropdown)}
              className="text-xs font-semibold text-white flex items-center gap-1 hover:text-ascend-primary transition-colors"
            >
              <span>
                {activeSession ? (activeSession.title ?? activeSession.Title) : "AI Career Coach"}
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-ascend-text-secondary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
              Context-Aware Assistant
            </p>
          </div>

          {/* Sessions Dropdown Popover */}
          {showSessionsDropdown && (
            <div className="absolute top-10 left-0 w-64 bg-ascend-surface border border-[rgba(255,255,255,0.08)] rounded-button shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="flex justify-between items-center px-2 py-1 mb-2 border-b border-ascend-border">
                <span className="text-[10px] font-bold text-ascend-text-secondary uppercase tracking-wider">
                  Select Session
                </span>
                <button
                  onClick={() => setShowSessionsDropdown(false)}
                  className="p-0.5 text-ascend-text-muted hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <form
                onSubmit={handleCreateSession}
                className="flex gap-1.5 p-1 mb-2"
              >
                <input
                  type="text"
                  placeholder="New session name..."
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-[11px] bg-black/40 border border-ascend-border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-ascend-ai transition-colors"
                />
                <button
                  type="submit"
                  disabled={isCreatingSession}
                  className="p-1 bg-ascend-ai hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-button transition-colors flex items-center justify-center"
                >
                  {isCreatingSession ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </button>
              </form>

              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {sessions.length === 0 ? (
                  <div className="p-3 text-center text-[10px] text-zinc-600">
                    No sessions. Create one above!
                  </div>
                ) : (
                  sessions.map((sess) => {
                    const sessId = sess.id ?? sess.Id;
                    return (
                      <button
                        key={sessId}
                        onClick={() => {
                          setActiveSessionId(sessId);
                          setShowSessionsDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-[11px] transition-all ${
                          activeSessionId === sessId
                            ? "bg-ascend-ai/10 text-white border border-ascend-ai/20"
                            : "hover:bg-white/5 text-ascend-text-secondary hover:text-white border border-transparent"
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{sess.title ?? sess.Title}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {floatingMode && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-ascend-text-muted hover:text-white rounded-button hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-ascend-bg">
        {isLoadingMessages ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-ascend-ai" />
          </div>
        ) : messages.length === 0 && !isSending ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-4 space-y-4">
            <div className="w-10 h-10 rounded-button bg-ascend-ai/10 border border-ascend-ai/20 flex items-center justify-center text-ascend-ai animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-zinc-200">
                Career Consultant AI
              </h4>
              <p className="text-[10px] text-ascend-text-muted max-w-[200px] mt-1">
                Your resume details are loaded. Ask me to rewrite bullet points,
                mock interview questions, or plan career goals.
              </p>
            </div>

            <div className="w-full space-y-1.5 pt-4 text-left">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest px-1 block mb-1">
                Suggested Actions
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPromptClick(prompt)}
                  className="w-full text-left p-2.5 rounded-xl border border-ascend-border bg-ascend-surface/40 hover:bg-ascend-surface text-[10px] text-ascend-text-secondary hover:text-white transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const role = msg.role ?? msg.Role;
              const isAssistant =
                role === "Assistant" ||
                role === "assistant" ||
                role === "System" ||
                role === "system";
              const messageId = `msg-${idx}`;

              return (
                <div
                  key={idx}
                  className={`flex gap-2.5 max-w-[90%] ${
                    isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                      isAssistant
                        ? "bg-ascend-ai/10 border-ascend-ai/20 text-ascend-ai"
                        : "bg-zinc-800 border-zinc-700 text-white"
                    }`}
                  >
                    {isAssistant ? (
                      <Sparkles className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <div
                      className={`px-3 py-2 rounded-card text-[11px] leading-relaxed group relative ${
                        isAssistant
                          ? "bg-ascend-surface border border-ascend-border text-white rounded-tl-sm"
                          : "bg-gradient-to-r from-ascend-primary to-ascend-ai text-black font-medium rounded-tr-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap select-text break-words">
                        {msg.content ?? msg.Content}
                      </p>

                      {isAssistant && (
                        <button
                          onClick={() => handleCopyText(msg.content ?? msg.Content, messageId)}
                          className="absolute right-2 top-2 p-1 bg-black/40 hover:bg-black/80 rounded border border-ascend-border opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy message"
                        >
                          {copiedId === messageId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-ascend-text-secondary" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {isSending && (
              <div className="flex gap-2.5 max-w-[80%] mr-auto">
                <div className="w-6 h-6 rounded-button bg-ascend-ai/10 border border-ascend-ai/20 flex items-center justify-center text-ascend-ai shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="px-3.5 py-2.5 rounded-card bg-ascend-surface border border-ascend-border text-ascend-text-muted text-[10px] rounded-tl-sm">
                  Coaching assistant is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Cursor-like Input Box */}
      <div className="p-4 border-t border-ascend-border bg-ascend-sidebar sticky bottom-0">
        <form
          onSubmit={handleSendMessage}
          className="relative rounded-button border border-[rgba(255,255,255,0.08)] bg-ascend-surface overflow-hidden focus-within:border-ascend-ai/50 transition-all focus-within:shadow-floating"
        >
          {/* Active Context Chips */}
          <div className="flex items-center gap-1.5 px-3 pt-2">
            <span className="px-2 py-0.5 rounded bg-ascend-ai/15 border border-ascend-ai/20 text-[9px] font-bold text-white flex items-center gap-1 select-none">
              <Command className="w-2.5 h-2.5" />
              <span>@workspace</span>
            </span>
          </div>

          <textarea
            rows={2}
            placeholder="Type a message or request context..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            disabled={isSending}
            className="w-full px-3 py-2 bg-transparent text-[11px] text-white placeholder-zinc-500 focus:outline-none resize-none font-sans"
          />

          <div className="flex items-center justify-between px-3 pb-2 border-t border-ascend-border pt-1.5 bg-black/10">
            <span className="text-[8.5px] text-ascend-text-muted flex items-center gap-1">
              <CornerDownLeft className="w-2.5 h-2.5" />
              <span>Enter to send</span>
            </span>

            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-1.5 bg-ascend-ai hover:bg-[#6D28D9] disabled:bg-zinc-800 disabled:opacity-40 text-white rounded-button transition-all flex items-center justify-center shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
