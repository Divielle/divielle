import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type InquiryForm = {
  name: string;
  email: string;
  inquiry: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryForm, setInquiryForm] = useState<InquiryForm>({
    name: "",
    email: "",
    inquiry: "",
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isNight } = useTheme();

  // Theme-aware colors
  const accent = isNight ? "#c9a96e" : "#D4AF37";
  const bgPanel = isNight ? "#0a0a0a" : "#ffffff";
  const bgMsg = isNight ? "#141414" : "#f5f3ef";
  const textPrimary = isNight ? "#f5f0e8" : "#1e1e1e";
  const textMuted = isNight ? "rgba(245,240,232,0.3)" : "rgba(13,5,5,0.4)";
  const borderBase = isNight ? `${accent}33` : "rgba(212,175,55,0.25)";

  const chatMutation = trpc.chatbot.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
      if (data.shouldEscalate) {
        setShowInquiryForm(true);
      }
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, I'm having trouble connecting right now. Please try again or email us at info@divielle.com.",
        },
      ]);
    },
  });

  const inquiryMutation = trpc.chatbot.submitInquiry.useMutation({
    onSuccess: (data) => {
      setInquirySubmitted(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      setShowInquiryForm(false);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "We couldn't send your inquiry. Please email us directly at info@divielle.com.",
        },
      ]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showInquiryForm]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || chatMutation.isPending) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(newMessages);
    setInput("");

    chatMutation.mutate({ messages: newMessages });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.inquiry) return;

    const chatHistory = messages
      .map((m) => `${m.role === "user" ? "Customer" : "Bot"}: ${m.content}`)
      .join("\n");

    inquiryMutation.mutate({
      ...inquiryForm,
      chatHistory,
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        data-cursor-hover
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[9999] w-14 h-14 rounded-full flex items-center justify-center group transition-all duration-500"
        style={{
          border: `1px solid ${accent}66`,
          backgroundColor: isNight ? "rgba(10,10,10,0.9)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isOpen ? 0 : 1, opacity: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: accent }}
        >
          <path
            d="M12 2C6.48 2 2 6.04 2 11c0 2.76 1.36 5.22 3.5 6.84V22l3.94-2.16c.83.22 1.68.36 2.56.36 5.52 0 10-4.04 10-9S17.52 2 12 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="11" r="1" fill="currentColor" />
          <circle cx="12" cy="11" r="1" fill="currentColor" />
          <circle cx="16" cy="11" r="1" fill="currentColor" />
        </svg>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-0 right-0 sm:bottom-8 sm:right-8 z-[10000] w-full sm:w-[400px] h-full sm:h-[600px] sm:max-h-[80vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-colors duration-500"
            style={{
              backgroundColor: bgPanel,
              border: `1px solid ${borderBase}`,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 transition-colors duration-500"
              style={{
                borderBottom: `1px solid ${borderBase}`,
                backgroundColor: bgPanel,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: accent }}
                />
                <span
                  className="text-sm font-light tracking-[0.15em] uppercase transition-colors duration-500"
                  style={{ color: textPrimary }}
                >
                  Divielle Assistant
                </span>
              </div>
              <button
                data-cursor-hover
                onClick={() => setIsOpen(false)}
                className="transition-colors duration-200 text-lg"
                style={{ color: textMuted }}
              >
                &#x2715;
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <p
                    className="text-sm font-light leading-relaxed transition-colors duration-500"
                    style={{ color: `${textPrimary}99` }}
                  >
                    Welcome to Divielle. I can help you explore our collections,
                    learn about our ingredients, or answer questions about the
                    brand.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {[
                      "Tell me about your collections",
                      "What products do you offer?",
                      "Shade recommendations",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        data-cursor-hover
                        onClick={() => {
                          setMessages([{ role: "user", content: prompt }]);
                          chatMutation.mutate({
                            messages: [{ role: "user", content: prompt }],
                          });
                        }}
                        className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                        style={{
                          border: `1px solid ${accent}33`,
                          color: `${accent}BB`,
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            backgroundColor: `${accent}1A`,
                            color: textPrimary,
                            border: `1px solid ${accent}33`,
                            borderRadius: "12px 12px 0 12px",
                          }
                        : {
                            backgroundColor: bgMsg,
                            color: `${textPrimary}CC`,
                            border: `1px solid ${isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                            borderRadius: "12px 12px 12px 0",
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div
                    className="rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: bgMsg,
                      border: `1px solid ${isNight ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
                    }}
                  >
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0ms]" style={{ backgroundColor: `${accent}80` }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:150ms]" style={{ backgroundColor: `${accent}80` }} />
                      <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:300ms]" style={{ backgroundColor: `${accent}80` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Inquiry Form */}
              {showInquiryForm && !inquirySubmitted && (
                <motion.form
                  onSubmit={handleInquirySubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg p-4 space-y-3"
                  style={{
                    backgroundColor: bgMsg,
                    border: `1px solid ${accent}26`,
                  }}
                >
                  <p
                    className="text-xs tracking-[0.2em] uppercase mb-2"
                    style={{ color: `${accent}BB` }}
                  >
                    Connect with our team
                  </p>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={inquiryForm.name}
                    onChange={(e) =>
                      setInquiryForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full rounded px-3 py-2 text-sm focus:outline-none transition-colors"
                    style={{
                      backgroundColor: bgPanel,
                      border: `1px solid ${accent}1A`,
                      color: textPrimary,
                    }}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={inquiryForm.email}
                    onChange={(e) =>
                      setInquiryForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full rounded px-3 py-2 text-sm focus:outline-none transition-colors"
                    style={{
                      backgroundColor: bgPanel,
                      border: `1px solid ${accent}1A`,
                      color: textPrimary,
                    }}
                    required
                  />
                  <textarea
                    placeholder="Your inquiry"
                    value={inquiryForm.inquiry}
                    onChange={(e) =>
                      setInquiryForm((f) => ({
                        ...f,
                        inquiry: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded px-3 py-2 text-sm focus:outline-none transition-colors resize-none"
                    style={{
                      backgroundColor: bgPanel,
                      border: `1px solid ${accent}1A`,
                      color: textPrimary,
                    }}
                    required
                  />
                  <button
                    type="submit"
                    data-cursor-hover
                    disabled={inquiryMutation.isPending}
                    className="w-full py-2.5 text-xs tracking-[0.2em] uppercase rounded transition-all duration-200 disabled:opacity-50"
                    style={{
                      backgroundColor: `${accent}1A`,
                      border: `1px solid ${accent}4D`,
                      color: accent,
                    }}
                  >
                    {inquiryMutation.isPending ? "Sending..." : "Submit Inquiry"}
                  </button>
                </motion.form>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="px-5 py-4 transition-colors duration-500"
              style={{
                borderTop: `1px solid ${borderBase}`,
                backgroundColor: bgPanel,
              }}
            >
              <div className="flex items-end gap-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Divielle..."
                  rows={1}
                  className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none transition-colors resize-none max-h-24"
                  style={{
                    backgroundColor: bgMsg,
                    border: `1px solid ${accent}1A`,
                    color: textPrimary,
                  }}
                />
                <button
                  data-cursor-hover
                  onClick={handleSend}
                  disabled={!input.trim() || chatMutation.isPending}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-30"
                  style={{
                    border: `1px solid ${accent}33`,
                    color: accent,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
