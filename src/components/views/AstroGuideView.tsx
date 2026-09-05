"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, RotateCcw, MapPin, Moon, Telescope, Calendar, Lightbulb } from "lucide-react";
import { StarField } from "@/components/common/StarField";
import { GlassCard } from "@/components/common/GlassCard";
import { useAppStore } from "@/store/app-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { icon: Moon, text: "Where can I see the Milky Way near me?", color: "text-purple-300" },
  { icon: Calendar, text: "Best place to see stars this weekend?", color: "text-primary" },
  { icon: Sparkles, text: "Where can I watch the next eclipse?", color: "text-amber-300" },
  { icon: Telescope, text: "What telescope should I use?", color: "text-accent" },
  { icon: MapPin, text: "What constellations can I see tonight?", color: "text-emerald-300" },
  { icon: Lightbulb, text: "Plan a 2-day stargazing trip.", color: "text-yellow-300" },
];

export function AstroGuideView() {
  const { chatMessages, chatLoading, addChatMessage, setChatLoading, clearChat, user } = useAppStore();
  const [input, setInput] = useState("");
  const [useLocation, setUseLocation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || chatLoading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user" as const,
      content,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput("");
    setChatLoading(true);

    try {
      const apiMessages = chatMessages
        .concat(userMsg)
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/astro-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          userLocation: useLocation ? "New York City, USA (40.71°N 74.00°W)" : undefined,
          date: new Date().toLocaleDateString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to reach AstroGuide");

      const data = await res.json();
      const replyMsg = {
        id: `a-${Date.now()}`,
        role: "assistant" as const,
        content: data.reply,
        timestamp: data.timestamp ?? new Date().toISOString(),
      };
      addChatMessage(replyMsg);
    } catch (err) {
      addChatMessage({
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "I'm having trouble connecting to the cosmos right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
      });
      toast.error("Connection issue — please try again");
    } finally {
      setChatLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="pt-16 pb-12 min-h-screen flex flex-col">
      {/* Header */}
      <section className="relative py-6 overflow-hidden">
        <StarField count={50} />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-pulse-glow" />
                <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="absolute -inset-1 rounded-full border border-primary/20 animate-spin-slow" />
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80 mb-0.5">
                  AI Astro Guide
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  AstroGuide<span className="text-gradient-cosmic ml-1">AI</span>
                </h1>
              </div>
            </div>
            <button
              onClick={() => { clearChat(); toast.success("Conversation reset"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </motion.div>
        </div>
      </section>

      {/* Chat container */}
      <section className="container mx-auto px-6 flex-1 flex flex-col">
        <GlassCard variant="strong" className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scroll p-4 space-y-4 min-h-[400px] max-h-[60vh]">
            {chatMessages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} userName={user?.name ?? "You"} />
            ))}
            {chatLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="relative h-8 w-8 shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent" />
                  <div className="absolute inset-1.5 rounded-full bg-background flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  {[0, 0.2, 0.4].map((d) => (
                    <div
                      key={d}
                      className="h-2 w-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Suggestion chips */}
          {chatMessages.length <= 1 && (
            <div className="px-4 pb-3">
              <div className="text-xs text-muted-foreground mb-2">Try asking:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                    onClick={() => send(s.text)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-white/5 text-left text-sm transition-all"
                  >
                    <s.icon className={cn("h-3.5 w-3.5 shrink-0", s.color)} />
                    <span className="text-foreground/90">{s.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Location toggle */}
          <div className="px-4 py-2 border-t border-white/5 flex items-center gap-2">
            <button
              onClick={() => setUseLocation(!useLocation)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors",
                useLocation ? "bg-primary/20 text-primary" : "glass text-muted-foreground"
              )}
            >
              <MapPin className="h-3 w-3" />
              {useLocation ? "Personalizing to NYC area" : "Use my location"}
            </button>
            <div className="text-xs text-muted-foreground ml-auto">
              AstroGuide is in beta · responses may vary
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask anything about the cosmos..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={chatLoading}
                className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground px-3 py-2 disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || chatLoading}
                className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:glow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function ChatMessage({ msg, userName }: { msg: { role: "user" | "assistant"; content: string }; userName: string }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-start gap-3 max-w-[90%]", isUser ? "ml-auto flex-row-reverse" : "")}
    >
      <div className={cn("h-8 w-8 rounded-full shrink-0 flex items-center justify-center", isUser ? "bg-gradient-to-br from-primary/60 to-accent/60" : "")}>
        {isUser ? (
          <span className="text-xs font-bold">{userName.charAt(0)}</span>
        ) : (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent" />
            <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>
        )}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-primary/20 rounded-tr-sm"
            : "glass rounded-tl-sm"
        )}
      >
        <FormattedContent content={msg.content} />
      </div>
    </motion.div>
  );
}

function FormattedContent({ content }: { content: string }) {
  // Simple markdown-like formatting: **bold**, bullet lists
  const lines = content.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Render bold inline
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={j} className="font-semibold text-primary">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        });
        if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
          return (
            <div key={i} className="flex items-start gap-1.5 pl-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{rendered.slice(0, 2).map((p, j) => <span key={j}>{p}</span>)}</span>
            </div>
          );
        }
        return <div key={i}>{rendered}</div>;
      })}
    </div>
  );
}
