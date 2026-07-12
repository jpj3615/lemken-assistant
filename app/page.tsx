"use client";

import { useEffect, useRef, useState } from "react";
import { SUGGESTED_QUESTIONS } from "@/lib/knowledge";

type Msg = { role: "user" | "assistant"; content: string };

// Minimal, safe formatter: escapes HTML, then renders **bold**, links, and
// line breaks. Avoids pulling in a markdown dependency for the demo.
function renderContent(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Full http(s) links
    .replace(
      /(https?:\/\/[^\s<)]+)(?![^<]*>)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Root-relative brochure links like /docs/juwel.pdf → clickable "View PDF"
    .replace(
      /(^|[\s(])(\/docs\/[A-Za-z0-9._-]+\.pdf)/g,
      '$1<a href="$2" target="_blank" rel="noopener noreferrer">View PDF</a>'
    )
    .replace(/\n/g, "<br/>");
}

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  function autosize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: Msg[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        let errMsg = "Something went wrong. Please try again.";
        try {
          const data = await res.json();
          if (data?.error) errMsg = data.error;
        } catch {
          /* ignore */
        }
        setMessages((m) => [...m, { role: "assistant", content: errMsg }]);
        setLoading(false);
        return;
      }

      // Add empty assistant bubble, then stream tokens into it.
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Connection error. Please check your network and try again, or contact your LEMKEN dealer.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const showWelcome = messages.length === 0;

  return (
    <div className="page">
      <header className="header">
        <span className="wordmark">LEMKEN</span>
        <span className="header-sub">
          <strong>Customer Assistant</strong>
          Instant answers · products, parts &amp; service
        </span>
      </header>

      <div className="chat-shell">
        <div className="messages" ref={scrollRef}>
          {showWelcome && (
            <div className="welcome">
              <h1>How can I help with your machine?</h1>
              <p>
                Ask about your Juwel, Diamant, Titan, Karat, Kristall, Heliodor,
                Rubin, Zirkon, Solitair DT, Compact-Solitair, Thulit, rollers and
                more. Answers link to the full brochure. Try one of these:
              </p>
              <div className="chips">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className="chip"
                    onClick={() => send(q)}
                    disabled={loading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`row ${m.role === "user" ? "user" : ""}`}>
              <div
                className={`bubble ${m.role === "user" ? "user" : "bot"}`}
                dangerouslySetInnerHTML={{ __html: renderContent(m.content) }}
              />
            </div>
          ))}

          {loading &&
            messages[messages.length - 1]?.role === "user" && (
              <div className="row">
                <div className="bubble bot">
                  <div className="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
        </div>

        <div className="composer">
          <div className="composer-inner">
            <textarea
              ref={taRef}
              value={input}
              placeholder="Ask about your LEMKEN machine…"
              rows={1}
              onChange={(e) => {
                setInput(e.target.value);
                autosize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <button
              className="send-btn"
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              ↑
            </button>
          </div>
          <div className="disclaimer">
            Demo assistant. For exact settings, torque values and warranty,
            always refer to your operating manual (LEONIS) or your authorised
            LEMKEN dealer.
          </div>
        </div>
      </div>
    </div>
  );
}
