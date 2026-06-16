"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Moon, Plus, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FOODS_INN_DEMO } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";
import { ChatInput } from "./ChatInput";
import { MessageBubble, TypingIndicator } from "./MessageBubble";

type Message = { role: "user" | "assistant"; content: string };
type ChatSession = {
  localId: string;
  backendId: string | null;
  title: string;
  messages: Message[];
  updatedAt: string;
};
type Theme = "light" | "dark";

const welcomeMessage: Message = {
  role: "assistant",
  content: "Hi! Welcome to Foods Inn. How can I help you today?"
};

const quickQuestions = [
  "Show me your menu",
  "What are your best deals?",
  "Do you offer delivery?",
  "Where are you located?",
  "I want to reserve a table",
  "What do you recommend for 4 people?"
];

function createLocalId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createSession(): ChatSession {
  return {
    localId: createLocalId(),
    backendId: null,
    title: "New chat",
    messages: [welcomeMessage],
    updatedAt: new Date().toISOString()
  };
}

function makeTitle(message: string) {
  return message.length > 34 ? `${message.slice(0, 34)}...` : message;
}

export function ChatWindow({ restaurantId }: { restaurantId: string }) {
  const storageKey = useMemo(() => `foodsinn-chat-sessions:${restaurantId}`, [restaurantId]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  const activeSession = sessions.find((session) => session.localId === activeSessionId) ?? sessions[0];

  useEffect(() => {
    const savedTheme = localStorage.getItem("foodsinn-theme") as Theme | null;
    setTheme(savedTheme === "dark" ? "dark" : "light");

    try {
      const savedSessions = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as ChatSession[];
      if (savedSessions.length > 0) {
        setSessions(savedSessions);
        setActiveSessionId(savedSessions[0].localId);
        return;
      }
    } catch {
      localStorage.removeItem(storageKey);
    }

    const firstSession = createSession();
    setSessions([firstSession]);
    setActiveSessionId(firstSession.localId);
  }, [storageKey]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("foodsinn-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(sessions));
    }
  }, [sessions, storageKey]);

  function updateSession(sessionId: string, updater: (session: ChatSession) => ChatSession) {
    setSessions((current) =>
      current
        .map((session) => (session.localId === sessionId ? updater(session) : session))
        .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    );
  }

  function startNewChat() {
    const session = createSession();
    setSessions((current) => [session, ...current]);
    setActiveSessionId(session.localId);
  }

  async function send(message: string) {
    const currentSession = activeSession ?? createSession();
    if (!activeSession) {
      setSessions([currentSession]);
      setActiveSessionId(currentSession.localId);
    }

    const sentAt = new Date().toISOString();
    updateSession(currentSession.localId, (session) => ({
      ...session,
      title: session.title === "New chat" ? makeTitle(message) : session.title,
      messages: [...session.messages, { role: "user", content: message }],
      updatedAt: sentAt
    }));

    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, sessionId: currentSession.backendId, message })
      });
      const data = await response.json();

      updateSession(currentSession.localId, (session) => ({
        ...session,
        backendId: data.sessionId ?? session.backendId,
        messages: [
          ...session.messages,
          { role: "assistant", content: data.answer ?? "Please contact the restaurant directly." }
        ],
        updatedAt: new Date().toISOString()
      }));
    } catch {
      updateSession(currentSession.localId, (session) => ({
        ...session,
        messages: [
          ...session.messages,
          { role: "assistant", content: "I could not reach the chatbot service. Please try again." }
        ],
        updatedAt: new Date().toISOString()
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto grid h-dvh w-full max-w-6xl overflow-hidden rounded-none border-0 md:h-[min(820px,calc(100vh-2rem))] md:grid-cols-[280px_1fr] md:rounded-lg md:border">
      <aside className="flex min-h-0 flex-col border-b bg-primary p-2 text-primary-foreground md:border-b-0 md:border-r md:p-3">
        <div className="flex items-center gap-2 px-1 py-1 md:px-2 md:py-2">
          <Image
            src="/foods-inn-logo.webp"
            alt="Foods Inn"
            width={40}
            height={40}
            className="h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
          />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">{FOODS_INN_DEMO.name}</h1>
            <p className="text-xs text-primary-foreground/75">AI chatbot</p>
          </div>
        </div>

        <div className="mt-2 flex gap-2 md:mt-3">
          <Button type="button" onClick={startNewChat} className="flex-1 justify-start" size="sm" variant="secondary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New chat
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            className="h-9 w-9"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 md:mt-4 md:min-h-0 md:flex-1 md:flex-col md:overflow-y-auto md:overflow-x-hidden">
          {sessions.map((session) => (
            <button
              key={session.localId}
              type="button"
              onClick={() => setActiveSessionId(session.localId)}
              className={cn(
                "min-w-40 rounded-md px-3 py-2 text-left text-sm transition md:min-w-0",
                session.localId === activeSession?.localId
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              <span className="block truncate font-medium">{session.title}</span>
              <span className={cn("block truncate text-xs", session.localId === activeSession?.localId ? "text-primary/75" : "text-primary-foreground/70")}>
                {new Date(session.updatedAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-h-0 flex-col bg-background">
        <div className="border-b bg-card px-3 py-2 md:px-4 md:py-3">
          <h2 className="text-base font-semibold">{activeSession?.title ?? "New chat"}</h2>
          <p className="text-sm text-muted-foreground">{FOODS_INN_DEMO.phone} - {FOODS_INN_DEMO.city}</p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-3 md:p-4">
          <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
            {quickQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => send(question)}
                disabled={loading}
                className="shrink-0 rounded-md border bg-card px-3 py-2 text-xs text-card-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>

          {(activeSession?.messages ?? [welcomeMessage]).map((message, index) => (
            <MessageBubble key={`${message.role}-${index}`} role={message.role} content={message.content} />
          ))}
          {loading ? <TypingIndicator /> : null}
        </div>

        <ChatInput onSend={send} disabled={loading} />
      </section>
    </Card>
  );
}
