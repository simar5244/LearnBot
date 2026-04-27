"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const PUBLIC_PATHS = new Set(["/", "/login", "/signup"]);

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Need help with this lesson? Ask me anything about the current module and I will walk through it step-by-step.",
    },
  ]);

  const visible = useMemo(() => !PUBLIC_PATHS.has(pathname || ""), [pathname]);
  if (!visible) return null;

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (text.length === 0 || sending) return;

    const next = [...messages, { role: "user" as const, text }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const reply = String(data.reply || "I could not generate a response right now. Try again.");
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "I hit a connection issue. Please try again in a second." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-widget-wrap">
      {open && (
        <section className="chat-widget-panel">
          <header className="chat-widget-head">
            <strong>My Tutor</strong>
            <div style={{ display: "flex", gap: 8 }}>
              <Link className="btn" href="/my-tutor-lab">My Tutor Lab</Link>
              <button className="btn" type="button" onClick={() => setOpen(false)}>Close</button>
            </div>
          </header>
          <div className="chat-widget-body">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form className="chat-widget-input" onSubmit={sendMessage}>
            <input
              className="input"
              placeholder="Ask for help with this step..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn primary" type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </section>
      )}
      <button className="chat-widget-fab" type="button" onClick={() => setOpen((v) => !v)}>
        {open ? "Hide My Tutor" : "My Tutor"}
      </button>
    </div>
  );
}
