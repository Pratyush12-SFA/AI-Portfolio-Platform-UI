import { useEffect, useState, useRef } from "react";
import {
  getChatSessions,
  createChatSession,
  getChatMessages,
  sendChatMessage,
} from "../../services/ai.service";
import {
  MessageSquare,
  Plus,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function AICoachingPanel() {
  const [sessions, setSessions] = useState<Portfolio.ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Portfolio.ChatMessage[]>([]);
  const [prevSessionId, setPrevSessionId] = useState<number | null>(activeSessionId);

  if (activeSessionId !== prevSessionId) {
    setPrevSessionId(activeSessionId);
    setMessages([]);
  }

  const [inputText, setInputText] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadSessions = async () => {
    try {
      const data = await getChatSessions();
      setSessions(data || []);
      if (data && data.length > 0 && activeSessionId === null) {
        setActiveSessionId(data[0].id ?? data[0].Id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async (sessionId: number) => {
    setIsLoadingMessages(true);
    try {
      const data = await getChatMessages(sessionId);
      setMessages(data || []);
    } catch (err) {
      console.error(err);
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
              return data[0].id ?? data[0].Id;
            }
            return prev;
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSessions();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const sessionId = activeSessionId;
    if (sessionId === null || isNaN(sessionId)) {
      return;
    }
    const validSessionId = sessionId as number;

    let active = true;
    async function fetchMessages() {
      setIsLoadingMessages(true);
      try {
        const data = await getChatMessages(validSessionId);
        if (active) {
          setMessages(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setIsLoadingMessages(false);
        }
      }
    }
    fetchMessages();

    return () => {
      active = false;
    };
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;
    setIsCreatingSession(true);
    try {
      const newSession = await createChatSession(newSessionTitle);
      await loadSessions();
      setActiveSessionId(newSession.id ?? newSession.Id);
      setNewSessionTitle("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || activeSessionId === null || isSending) return;

    const userMsgText = inputText.trim();
    setInputText("");
    setIsSending(true);

    // Optimistically add user message to chat UI
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMsgText,
        createdOn: new Date().toISOString(),
      },
    ]);

    try {
      await sendChatMessage(activeSessionId, userMsgText);
      await loadMessages(activeSessionId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPromptClick = async (prompt: string) => {
    let currentSessionId = activeSessionId;

    if (currentSessionId === null) {
      setIsCreatingSession(true);
      try {
        const newSession = await createChatSession("Quick AI Consultation");
        setSessions((prev) => [newSession, ...prev]);
        currentSessionId = newSession.id ?? newSession.Id;
        setActiveSessionId(newSession.id ?? newSession.Id);
      } catch (err) {
        console.error(err);
        setIsCreatingSession(false);
        return;
      } finally {
        setIsCreatingSession(false);
      }
    }

    if (currentSessionId !== null) {
      setInputText(prompt);
    }
  };

  const quickPrompts = [
    "Optimize my resume work details for an ATS match.",
    "Give me a mock interview question for a React engineer.",
    "Draft a professional summary focusing on System Architecture.",
    "What core technical skills are missing in my profile?",
  ];

  return (
    <div className="flex h-[calc(100vh-12rem)] rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
      {/* Sessions Sidebar */}
      <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950/50 backdrop-blur-md">
        <div className="p-4 border-b border-zinc-800">
          <form onSubmit={handleCreateSession} className="flex gap-2">
            <input
              type="text"
              placeholder="New session title..."
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isCreatingSession}
              className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            >
              {isCreatingSession ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">
              No sessions created yet. Type a title above to begin.
            </div>
          ) : (
            sessions.map((sess) => {
              const sessId = sess.id ?? sess.id;
              return (
                <button
                  key={sessId}
                  onClick={() => setActiveSessionId(sessId)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                    activeSessionId === sessId
                      ? "bg-amber-600/10 border border-amber-500/20 text-amber-500"
                      : "hover:bg-zinc-900/50 border border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-medium truncate">
                    {sess.title ?? sess.title}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {activeSessionId === null ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-radial-gradient">
            <div className="w-16 h-16 rounded-full bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 animate-pulse">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-200">
              Meet Your AI Career Coach
            </h2>
            <p className="text-sm text-zinc-400 max-w-sm mt-1 mb-6">
              Select an existing conversation from the sidebar or type a title
              to start a new chat.
            </p>

            <div className="w-full max-w-md space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 text-left mb-2 px-1">
                Suggested Consultations:
              </p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPromptClick(prompt)}
                  className="w-full text-left p-3 rounded-lg border border-zinc-800 hover:border-amber-500/30 bg-zinc-900/40 hover:bg-zinc-900 text-xs text-zinc-300 transition-all flex items-center justify-between group"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-amber-500 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                    Antigravity Coach
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-amber-600/20 text-amber-400 border border-amber-500/20">
                      online
                    </span>
                  </h3>
                  <p className="text-[10px] text-zinc-500">
                    Career Consultant & Resume Builder
                  </p>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingMessages ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const role = msg.role ?? msg.role;
                  const isAssistant =
                    role === "Assistant" ||
                    role === "assistant" ||
                    role === "System" ||
                    role === "system";
                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 max-w-[85%] ${
                        isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                          isAssistant
                            ? "bg-amber-600/10 border-amber-500/20 text-amber-500"
                            : "bg-zinc-800 border-zinc-700 text-zinc-300"
                        }`}
                      >
                        {isAssistant ? (
                          <Sparkles className="w-4.5 h-4.5" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>

                      <div
                        className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                          isAssistant
                            ? "bg-zinc-900 border border-zinc-800 text-zinc-300"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">
                          {msg.content ?? msg.content}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              {isSending && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask your coach anything about your resume, portfolio, or career..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isSending}
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-xs disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="px-5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-semibold disabled:opacity-40"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
