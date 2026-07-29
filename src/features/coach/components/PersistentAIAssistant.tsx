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
  floatingMode?: boolean;
}

export default function PersistentAIAssistant({
  isOpen = true,
  onClose,
  floatingMode = false,
}: PersistentAIAssistantProps) {
  const [sessions, setSessions] = useState<Portfolio.ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(() => {
    const saved = localStorage.getItem("active_chat_session_id");
    if (!saved || saved === "NaN") return null;
    const parsed = parseInt(saved);
    return isNaN(parsed) ? null : parsed;
  });
  const [messages, setMessages] = useState<Portfolio.ChatMessage[]>([]);
  const [prevSessionId, setPrevSessionId] = useState<number | null>(
    activeSessionId,
  );

  if (activeSessionId !== prevSessionId) {
    setPrevSessionId(activeSessionId);
    setMessages([]);
  }

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
          const firstId = data[0].id;
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
    let active = true;
    async function fetchSessions() {
      try {
        const data = await getChatSessions();
        if (active) {
          setSessions(data || []);
          setActiveSessionId((prev) => {
            if (data && data.length > 0 && prev === null) {
              const firstId = data[0].id;
              localStorage.setItem("active_chat_session_id", String(firstId));
              return firstId;
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("Error loading chat sessions:", err);
      }
    }
    fetchSessions();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const sessionId = activeSessionId;
    if (sessionId === null || isNaN(sessionId)) return;
    const validSessionId = sessionId as number;

    let active = true;
    async function fetchMessages() {
      setIsLoadingMessages(true);
      try {
        const data = await getChatMessages(validSessionId);
        if (active) {
          setMessages(data || []);
          localStorage.setItem(
            "active_chat_session_id",
            String(validSessionId),
          );
        }
      } catch (err) {
        console.error("Error loading messages:", err);
      } finally {
        if (active) setIsLoadingMessages(false);
      }
    }
    fetchMessages();
    return () => {
      active = false;
    };
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
      setActiveSessionId(newSession.id);
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

    if (sessionId === null) {
      setIsSending(true);
      try {
        const fallbackTitle =
          inputText.trim().substring(0, 24) || "New AI Consulting";
        const newSession = await createChatSession(fallbackTitle);
        await loadSessions(false);
        sessionId = newSession.id;
        setActiveSessionId(newSession.id);
      } catch (err) {
        console.error("Auto-session creation failed:", err);
      }
    }

    if (sessionId === null) return;

    const userMsgText = inputText.trim();
    setInputText("");
    setIsSending(true);

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

  const activeSession = sessions.find(
    (s) => s.id === activeSessionId,
  );

  if (!isOpen && !floatingMode) return null;

  return (
    <aside
      className={`w-80 bg-white border-l border-gray-200 flex flex-col h-screen sticky top-0 no-print z-20 shrink-0 ${
        floatingMode ? "w-full border-l-0" : ""
      }`}
    >
      {/* Assistant Header */}
      <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-2.5 relative">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#0052FF] to-[#4D7CFF] flex items-center justify-center shadow-[0_2px_8px_rgba(0,82,255,0.25)]">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <button
              onClick={() => setShowSessionsDropdown(!showSessionsDropdown)}
              className="text-xs font-semibold text-gray-800 flex items-center gap-1 hover:text-[#0052FF] transition-colors"
            >
              <span>
                {activeSession
                  ? activeSession.title
                  : "AI Career Coach"}
              </span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Context-Aware Assistant
            </p>
          </div>

          {/* Sessions Dropdown */}
          {showSessionsDropdown && (
            <div className="absolute top-10 left-0 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50">
              <div className="flex justify-between items-center px-2 py-1 mb-2 border-b border-gray-100">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Select Session
                </span>
                <button
                  onClick={() => setShowSessionsDropdown(false)}
                  className="p-0.5 text-gray-400 hover:text-gray-700 rounded"
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
                  className="flex-1 px-2.5 py-1.5 text-[11px] bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isCreatingSession}
                  className="p-1.5 bg-[#0052FF] hover:bg-[#0040CC] disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center"
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
                  <div className="p-3 text-center text-[10px] text-gray-400">
                    No sessions. Create one above!
                  </div>
                ) : (
                  sessions.map((sess) => {
                    const sessId = sess.id;
                    return (
                      <button
                        key={sessId}
                        onClick={() => {
                          setActiveSessionId(sessId);
                          setShowSessionsDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-[11px] transition-all ${
                          activeSessionId === sessId
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "hover:bg-gray-50 text-gray-600 hover:text-gray-800 border border-transparent"
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">
                          {sess.title}
                        </span>
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
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-[#FAFAFA]">
        {isLoadingMessages ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          </div>
        ) : messages.length === 0 && !isSending ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-4 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#0052FF] to-[#4D7CFF] flex items-center justify-center shadow-[0_4px_14px_rgba(0,82,255,0.3)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4
                className="text-sm font-bold text-gray-800"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Career Consultant AI
              </h4>
              <p className="text-[10.5px] text-gray-400 max-w-50 mt-1.5 leading-relaxed">
                Your resume details are loaded. Ask me to rewrite bullets,
                generate interview questions, or plan your career growth.
              </p>
            </div>

            <div className="w-full space-y-1.5 pt-2 text-left">
              <span className="section-label px-1 block mb-2">
                Suggested Actions
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPromptClick(prompt)}
                  className="w-full text-left p-2.5 rounded-xl border border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/50 text-[10.5px] text-gray-600 hover:text-blue-700 transition-all duration-150 shadow-xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isAssistant =
                msg.role === "Assistant" ||
                msg.role === "assistant" ||
                msg.role === "System" ||
                msg.role === "system";
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
                        ? "bg-blue-50 border-blue-100 text-blue-600"
                        : "bg-[#0052FF] border-[#0040CC] text-white"
                    }`}
                  >
                    {isAssistant ? (
                      <Sparkles className="w-3 h-3" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                  </div>

                  <div className="space-y-1 overflow-hidden">
                    <div
                      className={`px-3 py-2 text-[11px] leading-relaxed group relative ${
                        isAssistant
                          ? "bg-white border border-gray-200 text-gray-700 rounded-xl rounded-tl-sm shadow-xs"
                          : "bg-[#0052FF] text-white font-medium rounded-xl rounded-tr-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap select-text-wrap-break-words">
                        {msg.content}
                      </p>

                      {isAssistant && (
                        <button
                          onClick={() =>
                            handleCopyText(
                              msg.content,
                              messageId,
                            )
                          }
                          className="absolute right-2 top-2 p-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy message"
                        >
                          {copiedId === messageId ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400" />
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
                <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                  <Loader2 className="w-3 h-3 animate-spin" />
                </div>
                <div className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 text-[10px] rounded-tl-sm shadow-xs">
                  Coaching assistant is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-gray-100 bg-white sticky bottom-0">
        <form
          onSubmit={handleSendMessage}
          className="relative rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
        >
          <div className="flex items-center gap-1.5 px-3 pt-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[9px] font-semibold text-blue-600 flex items-center gap-1 select-none">
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
            className="w-full px-3 py-2 bg-transparent text-[11px] text-gray-800 placeholder-gray-400 focus:outline-none resize-none font-sans"
          />

          <div className="flex items-center justify-between px-3 pb-2 border-t border-gray-100 pt-1.5">
            <span className="text-[8.5px] text-gray-400 flex items-center gap-1">
              <CornerDownLeft className="w-2.5 h-2.5" />
              <span>Enter to send</span>
            </span>

            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-1.5 bg-[#0052FF] hover:bg-[#0040CC] disabled:bg-gray-200 disabled:opacity-60 text-white rounded-lg transition-all flex items-center justify-center shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
