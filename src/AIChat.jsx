
import { useEffect, useRef, useState } from "react";
import "./AIChat.css";

const API_URL = "http://127.0.0.1:3001/api/chat";

const WELCOME_MESSAGE = {
  role: "assistant",
  text: "Hi! 💚 I'm SOBERPATH AI. You can talk to me in Tamil, Tanglish, or English. I'm here to listen without judging you. How can I support you today?",
};

export default function AIChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Open chat from the navbar
  useEffect(() => {
    const openChat = () => setIsOpen(true);

    window.addEventListener("open-soberpath-chat", openChat);

    return () => {
      window.removeEventListener("open-soberpath-chat", openChat);
    };
  }, []);

  // Scroll to the newest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages, loading, isOpen]);

  // Focus the input when chat opens
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen]);

  async function sendMessage(event) {
    event.preventDefault();

    const message = input.trim();

    if (!message || loading) return;

    // Keep only previous user/model messages for the backend.
    // The welcome message is not part of the AI conversation history.
    const history = messages
      .filter(
        (item) =>
          (item.role === "user" || item.role === "assistant") &&
          item !== WELCOME_MESSAGE &&
          !item.isError
      )
      .slice(-12)
      .map((item) => ({
        role: item.role === "assistant" ? "model" : "user",
        text: item.text,
      }));

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: message,
      },
    ]);

    setInput("");
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history,
        }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.reply || `Request failed with status ${response.status}.`
        );
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The AI returned an empty response. Please try again.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: data.reply.trim(),
        },
      ]);
    } catch (error) {
      console.error("SOBERPATH AI chat error:", error);

      let errorMessage;

      if (error.name === "AbortError") {
        errorMessage =
          "The request took too long. Please check your connection and try again.";
      } else if (error instanceof TypeError) {
        errorMessage =
          "I couldn't connect to the AI server. Please check that the backend is running on port 3001.";
      } else {
        errorMessage =
          error.message || "Something went wrong. Please try again.";
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  function closeChat() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="ai-chat-toggle"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        aria-controls="soberpath-chat-window"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <section
          id="soberpath-chat-window"
          className="ai-chat-window"
          aria-label="SOBERPATH AI chat"
        >
          <header className="ai-chat-header">
            <div>
              <h3>💚 SOBERPATH AI</h3>
              <p>Your supportive AI companion</p>

              <span className="ai-chat-status">
                <span className="ai-status-dot" />
                Ready to listen
              </span>
            </div>

            <button
              type="button"
              className="ai-chat-close"
              onClick={closeChat}
              aria-label="Close chat"
            >
              ✕
            </button>
          </header>

          <div className="ai-chat-messages" aria-live="polite">
            {messages.map((item, index) => (
              <div
                key={`${index}-${item.role}`}
                className={`ai-chat-message ${
                  item.role === "user" ? "user" : "assistant"
                }`}
              >
                {item.text}
              </div>
            ))}

            {loading && (
              <div className="ai-chat-message assistant" role="status">
                Thinking... 💭
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="ai-chat-form" onSubmit={sendMessage}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type in Tamil or English..."
              aria-label="Your message"
              maxLength={4000}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? "…" : "➤"}
            </button>
          </form>

          <p className="ai-chat-disclaimer">
            AI can make mistakes. For medical advice, contact a qualified
            healthcare professional.
          </p>
        </section>
      )}
    </>
  );
}

