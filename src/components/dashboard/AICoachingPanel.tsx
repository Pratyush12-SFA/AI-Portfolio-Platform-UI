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
        setActiveSessionId(data[0].Id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async (sessionId: number) => {
    setIsLoadingMessages(true);
    try {
      const data = await getChatMessages(sessionId);
      const validSorted = (data || [])
        .filter((msg: Portfolio.ChatMessage) => msg && msg.Content && msg.Content.trim())
        .sort((a: Portfolio.ChatMessage, b: Portfolio.ChatMessage) => {
          const timeA = a.CreatedOn ? new Date(a.CreatedOn).getTime() : 0;
          const timeB = b.CreatedOn ? new Date(b.CreatedOn).getTime() : 0;
          return timeA - timeB;
        });
      setMessages(validSorted);
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
              return data[0].Id;
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
          const validSorted = (data || [])
            .filter((msg: Portfolio.ChatMessage) => msg && msg.Content && msg.Content.trim())
            .sort((a: Portfolio.ChatMessage, b: Portfolio.ChatMessage) => {
              const timeA = a.CreatedOn ? new Date(a.CreatedOn).getTime() : 0;
              const timeB = b.CreatedOn ? new Date(b.CreatedOn).getTime() : 0;
              return timeA - timeB;
            });
          setMessages(validSorted);
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
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isSending, isLoadingMessages]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle.trim()) return;
    setIsCreatingSession(true);
    try {
      const newSession = await createChatSession(newSessionTitle);
      await loadSessions();
      setActiveSessionId(newSession.Id);
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
        Role: "user",
        Content: userMsgText,
        CreatedOn: new Date().toISOString(),
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
        currentSessionId = newSession.Id;
        setActiveSessionId(newSession.Id);
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
    <div className="flex h-[calc(100vh-12rem)] rounded-xl border border-ascend-border bg-ascend-bg overflow-hidden shadow-2xl">
      {/* Sessions Sidebar */}
      <div className="w-80 border-r border-ascend-border flex flex-col bg-ascend-bg/50 backdrop-blur-md">
        <div className="p-4 border-b border-ascend-border">
          <form onSubmit={handleCreateSession} className="flex gap-2">
            <input
              type="text"
              placeholder="New session title..."
              value={newSessionTitle}
              onChange={(e) => setNewSessionTitle(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm bg-ascend-surface-elevated border border-ascend-border rounded-lg text-ascend-text-primary placeholder-ascend-text-muted focus:outline-none focus:border-ascend-primary transition-colors"
            />
            <button
              type="submit"
              disabled={isCreatingSession}
              className="p-2 bg-ascend-primary hover:bg-ascend-primary-hover text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
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
            <div className="p-4 text-center text-xs text-ascend-text-muted">
              No sessions created yet. Type a title above to begin.
            </div>
          ) : (
            sessions.map((sess) => {
              const sessId = sess.Id;
              return (
                <button
                  key={sessId}
                  onClick={() => setActiveSessionId(sessId)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                    activeSessionId === sessId
                      ? "bg-ascend-primary/10 border border-ascend-primary/20 text-ascend-primary"
                      : "hover:bg-ascend-surface-elevated/50 border border-transparent text-ascend-text-muted hover:text-ascend-text-primary"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-medium truncate">
                    {sess.Title}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-ascend-bg">
        {activeSessionId === null ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-radial-gradient">
            <div className="w-16 h-16 rounded-full bg-ascend-primary/10 border border-ascend-primary/20 flex items-center justify-center text-ascend-primary mb-4 animate-pulse">
              <Bot className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-semibold text-ascend-text-primary">
              Meet Your AI Career Coach
            </h2>
            <p className="text-sm text-ascend-text-muted max-w-sm mt-1 mb-6">
              Select an existing conversation from the sidebar or type a title
              to start a new chat.
            </p>

            <div className="w-full max-w-md space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-ascend-text-muted text-left mb-2 px-1">
                Suggested Consultations:
              </p>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPromptClick(prompt)}
                  className="w-full text-left p-3 rounded-lg border border-ascend-border hover:border-ascend-primary/30 bg-ascend-surface-elevated/40 hover:bg-ascend-surface-elevated text-xs text-ascend-text-secondary transition-all flex items-center justify-between group"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-ascend-primary transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-ascend-border flex items-center justify-between bg-ascend-bg/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-ascend-primary/20 border border-ascend-primary/30 flex items-center justify-center text-ascend-primary">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-ascend-text-primary flex items-center gap-1.5">
                    Antigravity Coach
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-ascend-primary/20 text-ascend-primary border border-ascend-primary/20">
                      online
                    </span>
                  </h3>
                  <p className="text-[10px] text-ascend-text-muted">
                    Career Consultant & Resume Builder
                  </p>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoadingMessages ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-ascend-primary" />
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const role = msg.Role;
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
                            ? "bg-ascend-primary/10 border-ascend-primary/20 text-ascend-primary"
                            : "bg-ascend-surface-elevated border-ascend-border text-ascend-text-secondary"
                        }`}
                      >
                        {isAssistant ? (
                          <Sparkles className="w-4.5 h-4.5" />
                        ) : (
                          <User className="w-4.5 h-4.5" />
                        )}
                      </div>

                      <div
                        className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                          isAssistant
                            ? "bg-ascend-surface-elevated border border-ascend-border text-ascend-text-secondary"
                            : "bg-ascend-primary text-white"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">
                          {msg.Content}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              {isSending && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-8 h-8 rounded-full bg-ascend-primary/10 border border-ascend-primary/20 flex items-center justify-center text-ascend-primary shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-ascend-surface-elevated border border-ascend-border text-ascend-text-muted text-xs">
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-ascend-border bg-ascend-bg/80 backdrop-blur-md">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask your coach anything about your resume, portfolio, or career..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isSending}
                  className="flex-1 px-4 py-3 bg-ascend-surface-elevated border border-ascend-border rounded-xl text-ascend-text-primary placeholder-ascend-text-muted focus:outline-none focus:border-ascend-primary transition-colors text-xs disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="px-5 bg-ascend-primary hover:bg-ascend-primary-hover disabled:bg-ascend-surface-elevated text-white rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-semibold disabled:opacity-40"
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
