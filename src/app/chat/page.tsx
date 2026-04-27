"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (text.length === 0) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: "bot", text: data.reply || "" }]);
    setLoading(false);
  }

  return (
    <div className="container">
      <Nav />
      <div className="section card">
        <h3>Ask the tutor</h3>
        <div className="section list">
          {messages.map((m, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: 12,
                background: m.role === "user" ? "#eff6ff" : "#ffffff",
              }}
            >
              <div style={{ fontWeight: 600 }}>{m.role === "user" ? "You" : "Tutor"}</div>
              <div>{m.text}</div>
            </div>
          ))}
          {loading && <div className="muted">Thinking...</div>}
        </div>
        <div className="section" style={{ display: "flex", gap: 8 }}>
          <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a question" />
          <button className="btn primary" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  );
}
