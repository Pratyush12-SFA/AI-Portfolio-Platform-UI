import { useState, useEffect } from "react";
import {
  Mail,
  Trash2,
  User,
  Building2,
  Clock,
  Sparkles,
  Inbox,
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  company?: string;
  read: boolean;
}

export default function MessagesWorkspace() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

  // Initialize messages list with preset mock recruiter messages + any local updates
  useEffect(() => {
    const local = localStorage.getItem("workspace_received_messages");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        setMessages(parsed);
        if (parsed.length > 0) {
          setActiveMessageId(parsed[0].id);
        }
      } catch {
        initializeMockMessages();
      }
    } else {
      initializeMockMessages();
    }
  }, []);

  const initializeMockMessages = () => {
    const mocks: ContactMessage[] = [
      {
        id: "msg-mock-1",
        name: "Sarah Jenkins",
        company: "Stripe",
        email: "sjenkins@stripe.com",
        subject: "Opportunity: Lead UI Systems Architect",
        message:
          "Hi Pratyush,\n\nI reviewed your AI-driven Portfolio and was extremely impressed by your experience mapping and system architectures. We are currently looking for a Lead UI Systems Architect to join our design systems division at Stripe.\n\nYour profile indicates deep expertise in React 19, Vite, and custom engineering frameworks. I would love to schedule a brief 15-minute consultation to chat about what you are looking for in your next role.\n\nBest regards,\nSarah Jenkins\nPrincipal Executive Talent - Stripe",
        date: "Yesterday, 3:14 PM",
        read: false,
      },
      {
        id: "msg-mock-2",
        name: "Marcus Aurelius",
        company: "Vercel",
        email: "marcus.a@vercel.com",
        subject: "Vite + Tailwind engineering feedback",
        message:
          "Hey Pratyush,\n\nGuillermo forwarded your portfolio URL over to our DevRel squad. The custom theme integrations you built (especially the Cyberpunk responsive layout) are incredible! The transitions are remarkably smooth.\n\nWe have a few remote-first roles opening up next month for Senior Developer Advocates. Let me know if you would be open to aligning on a quick sync next week!\n\nBest,\nMarcus\nEngineering Manager, Vercel",
        date: "3 days ago",
        read: true,
      },
      {
        id: "msg-mock-3",
        name: "David Hass",
        company: "Tesla",
        email: "dhass@tesla.com",
        subject: "Recruiter inquiry regarding career timeline",
        message:
          "Hello Pratyush,\n\nI am a technical sourcer at Tesla supporting our Autopilot UI teams. I noticed your career highlights and the projects you built focusing on telemetry data charts. Are you currently open to exploring new roles in Palo Alto or remote configurations?\n\nLet me know and we can set up some technical alignment.\n\nBest,\nDavid Hass",
        date: "1 week ago",
        read: true,
      },
    ];

    setMessages(mocks);
    localStorage.setItem("workspace_received_messages", JSON.stringify(mocks));
    if (mocks.length > 0) {
      setActiveMessageId(mocks[0].id);
    }
  };

  const handleSelectMessage = (id: string) => {
    setActiveMessageId(id);
    const updated = messages.map((msg) => {
      if (msg.id === id) return { ...msg, read: true };
      return msg;
    });
    setMessages(updated);
    localStorage.setItem(
      "workspace_received_messages",
      JSON.stringify(updated),
    );
  };

  const handleDeleteMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = messages.filter((msg) => msg.id !== id);
    setMessages(updated);
    localStorage.setItem(
      "workspace_received_messages",
      JSON.stringify(updated),
    );
    if (activeMessageId === id) {
      setActiveMessageId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const activeMessage = messages.find((m) => m.id === activeMessageId);

  return (
    <div className="space-y-6 select-none h-[calc(100vh-8rem)] flex flex-col">
      {/* Upper header */}
      <div className="px-1 flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide">
            Recruiter Messages Inbox
          </h3>
          <p className="text-[10px] text-ascend-text-secondary font-light">
            Manage incoming recruiter consultation requests and contact form
            inquiries.
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-ascend-surface border border-dashed border-ascend-border rounded-card">
          <div className="w-12 h-12 rounded-button bg-white/5 flex items-center justify-center text-ascend-text-muted mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-semibold text-white">
            Your Inbox is Empty
          </h4>
          <p className="text-[10px] text-zinc-550 max-w-xs mt-1">
            Visitor contact logs sent from your public portfolio page will
            appear here automatically.
          </p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 overflow-hidden min-h-0">
          {/* Messages list */}
          <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg.id)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 relative group flex flex-col justify-between ${
                  activeMessageId === msg.id
                    ? "bg-ascend-surface border-ascend-primary/40"
                    : "bg-ascend-surface/40 border-ascend-border hover:bg-ascend-surface hover:border-ascend-border"
                }`}
              >
                {/* Blue unread bullet */}
                {!msg.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
                )}

                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate max-w-[150px]">
                      {msg.name}
                    </span>
                    {msg.company && (
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-ascend-border text-[9px] font-semibold text-ascend-text-secondary">
                        {msg.company}
                      </span>
                    )}
                  </div>
                  <h4 className="text-[11px] text-white truncate font-semibold">
                    {msg.subject}
                  </h4>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-ascend-border">
                  <span className="text-[9px] text-zinc-550 flex items-center gap-1 font-mono">
                    <Clock className="w-2.5 h-2.5" />
                    {msg.date.split(",")[0]}
                  </span>

                  <button
                    onClick={(e) => handleDeleteMessage(msg.id, e)}
                    className="p-1 text-ascend-text-muted hover:text-red-400 rounded hover:bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete message"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Reading pane */}
          {activeMessage ? (
            <div className="p-6 bg-ascend-surface border border-ascend-border rounded-card flex flex-col h-full overflow-hidden shadow-xl">
              {/* Header card */}
              <div className="flex justify-between items-start border-b border-ascend-border pb-4 shrink-0">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-button bg-white/5 flex items-center justify-center text-ascend-primary border border-ascend-border">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-white">
                      {activeMessage.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-ascend-text-secondary">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {activeMessage.company || "Independent Recruiter"}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{activeMessage.email}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-ascend-text-muted font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeMessage.date}
                </span>
              </div>

              {/* Message text body */}
              <div className="flex-1 overflow-y-auto py-6 text-xs text-white leading-relaxed font-sans whitespace-pre-wrap select-text pr-1">
                {activeMessage.message}
              </div>

              {/* Reading Actions footer */}
              <div className="border-t border-ascend-border pt-4 flex justify-between items-center shrink-0">
                <span className="text-[9px] font-bold text-ascend-text-muted uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-ascend-primary" />
                  <span>AI Recruiter Sync Active</span>
                </span>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${activeMessage.subject}`}
                    className="px-4 py-2 rounded-button bg-ascend-primary hover:bg-ascend-primary/90 text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg"
                  >
                    <span>Reply via Email</span>
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-ascend-surface/30 border border-dashed border-ascend-border rounded-card flex items-center justify-center text-zinc-550 text-xs">
              Select a message to display reading pane
            </div>
          )}
        </div>
      )}
    </div>
  );
}
