"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PromptInput from "@/components/PromptInput";
import ChatPanel, { PanelState } from "@/components/ChatPanel";
import ReasoningPanel, { ReasoningStep, ReasoningResult } from "@/components/ReasoningPanel";
import ModelSelector from "@/components/ModelSelector";
import RightPanel from "@/components/RightPanel";
import { AIModel, DEFAULT_MODELS, getProviderColor, MODELS } from "@/lib/models";
import styles from "./page.module.css";

type ApiMessage = { role: "system" | "user" | "assistant"; content: string };

const MAX_RECENT_MESSAGES = 8;

function buildContextMessages(messages: ApiMessage[]): ApiMessage[] {
  if (messages.length <= MAX_RECENT_MESSAGES + 2) return messages;

  const older = messages.slice(0, messages.length - MAX_RECENT_MESSAGES);
  const recent = messages.slice(messages.length - MAX_RECENT_MESSAGES);

  const summaryParts: string[] = [];
  for (const m of older) {
    const tag = m.role === "user" ? "User" : m.role === "assistant" ? "Assistant" : "System";
    const snippet = m.content.length > 120 ? m.content.slice(0, 120) + "…" : m.content;
    summaryParts.push(`${tag}: ${snippet}`);
  }
  const summary = summaryParts.join("\n");

  return [
    { role: "system", content: `Summary of earlier conversation:\n${summary}` },
    ...recent,
  ];
}

type TabState = PanelState & { tabId: string; requestId: string | null };

function makeTabId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createTab(model: AIModel): TabState {
  return {
    tabId: makeTabId(),
    requestId: null,
    model,
    messages: [],
    status: "idle",
  };
}

function updateLastAssistant(messages: PanelState["messages"], content: string) {
  if (messages.length === 0) return messages;
  const last = messages[messages.length - 1];
  if (last?.role !== "assistant") return messages;
  const next = messages.slice();
  next[next.length - 1] = { role: "assistant", content };
  return next;
}

function tryParseJson(input: string): unknown | null {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function extractDeltaContent(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const choices = (payload as Record<string, unknown>)["choices"];
  if (!Array.isArray(choices) || choices.length === 0) return "";

  const first = choices[0];
  if (!first || typeof first !== "object") return "";
  const firstObj = first as Record<string, unknown>;

  const delta = firstObj["delta"];
  if (delta && typeof delta === "object") {
    const content = (delta as Record<string, unknown>)["content"];
    if (typeof content === "string") return content;
  }

  const message = firstObj["message"];
  if (message && typeof message === "object") {
    const content = (message as Record<string, unknown>)["content"];
    if (typeof content === "string") return content;
  }

  return "";
}

async function streamChatCompletion(args: {
  model: string;
  messages: ApiMessage[];
  apiKey?: string;
  signal?: AbortSignal;
  onDelta: (delta: string) => void;
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: args.model,
      messages: args.messages,
      apiKey: args.apiKey || undefined,
    }),
    signal: args.signal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const lines = part.split("\n");
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice("data:".length).trim();
        if (!data) continue;
        if (data === "[DONE]") return;

        const json = tryParseJson(data);
        if (!json) continue;

        const delta = extractDeltaContent(json);
        if (delta) args.onDelta(delta);
      }
    }
  }
}

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const [tabs, setTabs] = useState<TabState[]>(() => [createTab(DEFAULT_MODELS[0] ?? DEFAULT_MODELS[DEFAULT_MODELS.length - 1])]);
  const [chatHistory, setChatHistory] = useState<TabState[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [appMode, setAppMode] = useState<"normal" | "reasoning">("normal");

  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [reasoningResult, setReasoningResult] = useState<ReasoningResult | null>(null);
  const [reasoningError, setReasoningError] = useState<string | null>(null);
  const [isReasoningRunning, setIsReasoningRunning] = useState(false);
  const [currentReasoningStep, setCurrentReasoningStep] = useState(0);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);

  const [modelPickerTabId, setModelPickerTabId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const abortControllers = useRef<Record<string, AbortController | null>>({});

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.username) {
          setUsername(data.username);
        } else {
          router.push("/login");
        }
        setAuthLoaded(true);
      })
      .catch(() => setAuthLoaded(true));
  }, [router]);

  useEffect(() => {
    if (authLoaded && username) {
      const saved = localStorage.getItem(`chats_${username}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setChatHistory(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved chats", e);
        }
      }
    }
  }, [authLoaded, username]);

  useEffect(() => {
    if (authLoaded && username) {
      localStorage.setItem(`chats_${username}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, authLoaded, username]);

  useEffect(() => {
    setChatHistory(prev => {
      let updated = [...prev];
      let changed = false;

      for (const tab of tabs) {
        if (tab.messages.length > 0) {
          const existingIdx = updated.findIndex(t => t.tabId === tab.tabId);
          if (existingIdx >= 0) {
            if (updated[existingIdx] !== tab) {
              updated[existingIdx] = tab;
              changed = true;
            }
          } else {
            updated = [tab, ...updated];
            changed = true;
          }
        }
      }
      return changed ? updated : prev;
    });
  }, [tabs]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleChatSelect = (tabId: string) => {
    const existingTabIndex = tabs.findIndex(t => t.tabId === tabId);
    if (existingTabIndex >= 0) {
      setActiveIndex(existingTabIndex);
      return;
    }

    const historyItem = chatHistory.find(t => t.tabId === tabId);
    if (historyItem) {
      setTabs(prev => {
        const next = [...prev, historyItem];
        setActiveIndex(next.length - 1);
        return next;
      });
    }
  };

  const handleSend = async (prompt: string, _mode: "general") => {
    setBanner(null);

    if (tabs.length === 0) return;

    if (appMode === "reasoning") {
      setIsReasoningRunning(true);
      setReasoningError(null);
      setReasoningResult(null);
      setReasoningSteps([]);
      setLiveLogs([]);
      setCurrentReasoningStep(1);
      
      try {
        setReasoningSteps([{ step: 1, label: "Gathering initial perspectives..." }]);
        const answers: { model: string; content: string }[] = [];
        
        const tasks = tabs.map(async (tab) => {
          let content = "";
          setLiveLogs(prev => [...prev, `[${tab.model.id}] Starting initial analysis...`]);
          await streamChatCompletion({
            model: tab.model.id,
            messages: [{ role: "user", content: prompt }],
            onDelta: (d) => { content += d; }
          });
          answers.push({ model: tab.model.name, content });
          setLiveLogs(prev => [...prev, `[${tab.model.id}] Completed initial response.`]);
        });
        await Promise.allSettled(tasks);

        setCurrentReasoningStep(2);
        setReasoningSteps(prev => [...prev, { step: 2, label: "Cross-critiquing responses..." }]);
        const critiques: { model: string; critique: string }[] = [];
        
        const critiquePrompt = `Original user prompt: ${prompt}\n\nHere are the answers from other AI models:\n${answers.map(a => `[${a.model}]: ${a.content}`).join("\n\n")}\n\nPlease critique these answers, point out any contradictions or errors, and provide your refined perspective.`;
        
        const critiqueTasks = tabs.map(async (tab) => {
          let content = "";
          setLiveLogs(prev => [...prev, `[${tab.model.id}] Reviewing peer responses and finding contradictions...`]);
          await streamChatCompletion({
            model: tab.model.id,
            messages: [{ role: "user", content: critiquePrompt }],
            onDelta: (d) => { content += d; }
          });
          critiques.push({ model: tab.model.name, critique: content });
          setLiveLogs(prev => [...prev, `[${tab.model.id}] Completed cross-critique.`]);
        });
        await Promise.allSettled(critiqueTasks);

        setCurrentReasoningStep(3);
        setReasoningSteps(prev => [...prev, { step: 3, label: "Jury synthesizing final verdict..." }]);
        
        const juryModelId = "openrouter/owl-alpha";
        const synthesisPrompt = `Original user prompt: ${prompt}\n\nInitial answers:\n${answers.map(a => `[${a.model}]: ${a.content}`).join("\n\n")}\n\nCross-critiques:\n${critiques.map(c => `[${c.model}]: ${c.critique}`).join("\n\n")}\n\nBased on all this information, act as the Jury and provide the final, hallucination-resistant, comprehensive verdict.`;
        
        setLiveLogs(prev => [...prev, `[Jury: ${juryModelId}] Reading all context and synthesizing...`]);
        let finalAnswer = "";
        await streamChatCompletion({
          model: juryModelId,
          messages: [{ role: "user", content: synthesisPrompt }],
          onDelta: (d) => { finalAnswer += d; }
        });
        setLiveLogs(prev => [...prev, `[Jury: ${juryModelId}] Synthesis complete.`]);

        setReasoningResult({
          finalAnswer,
          restructuredPrompt: prompt,
          models: tabs.map(t => t.model.name),
          answers,
          critiques,
        });
        setCurrentReasoningStep(4);
      } catch (e: any) {
        setReasoningError(e.message || "Failed during reasoning process");
      } finally {
        setIsReasoningRunning(false);
      }
      return;
    }

    const userMsg = { role: "user" as const, content: prompt };

    // Abort any in-flight streams and create request IDs
    const requestByTabId: Record<string, string> = {};
    for (const t of tabs) {
      abortControllers.current[t.tabId]?.abort();
      abortControllers.current[t.tabId] = null;
      requestByTabId[t.tabId] = makeTabId();
    }

    setTabs((prev) =>
      prev.map((t) => ({
        ...t,
        requestId: requestByTabId[t.tabId] ?? t.requestId,
        status: "loading",
        error: undefined,
        messages: [...t.messages, userMsg, { role: "assistant", content: "" }],
      }))
    );

    const tasks = tabs.map((tab) => {
      const tabId = tab.tabId;
      const requestId = requestByTabId[tabId]!;
      const controller = new AbortController();
      abortControllers.current[tabId] = controller;

      const baseMessages: ApiMessage[] = tab.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const apiMessages: ApiMessage[] = buildContextMessages([...baseMessages, userMsg]);
      let assistant = "";
      let scheduled = false;

       return streamChatCompletion({
         model: tab.model.id,
         messages: apiMessages,
         apiKey: undefined,
         signal: controller.signal,
        onDelta: (delta) => {
          assistant += delta;
          if (scheduled) return;
          scheduled = true;
          requestAnimationFrame(() => {
            scheduled = false;
            setTabs((prev) =>
              prev.map((t) =>
                t.tabId !== tabId || t.requestId !== requestId
                  ? t
                  : {
                      ...t,
                      status: "streaming",
                      messages: updateLastAssistant(t.messages, assistant),
                    }
              )
            );
          });
        },
      })
        .then(() => {
          setTabs((prev) =>
            prev.map((t) =>
              t.tabId !== tabId || t.requestId !== requestId
                ? t
                : {
                    ...t,
                    status: "done",
                    messages: updateLastAssistant(t.messages, assistant),
                  }
            )
          );
        })
        .catch((err: unknown) => {
          const maybeAbort =
            err &&
            typeof err === "object" &&
            "name" in err &&
            (err as { name?: string }).name === "AbortError";
          if (maybeAbort) return;

          const message = err instanceof Error ? err.message : "Request failed";
          setTabs((prev) =>
            prev.map((t) =>
              t.tabId !== tabId || t.requestId !== requestId ? t : { ...t, status: "error", error: message }
            )
          );
        });
    });

    await Promise.allSettled(tasks);
  };

  const handleRetry = async (tabId: string) => {
    setBanner(null);

    const tab = tabs.find((t) => t.tabId === tabId);
    if (!tab) return;

    const msgs = tab.messages;
    const lastUserIndex = (() => {
      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i]?.role === "user") return i;
      }
      return -1;
    })();
    if (lastUserIndex < 0) return;

    abortControllers.current[tabId]?.abort();
    const controller = new AbortController();
    abortControllers.current[tabId] = controller;
    const requestId = makeTabId();

  const trimmed = msgs.slice(0, lastUserIndex + 1);
  const apiMessages: ApiMessage[] = buildContextMessages(trimmed.map((m) => ({ role: m.role, content: m.content })));

    setTabs((prev) =>
      prev.map((t) =>
        t.tabId !== tabId
          ? t
          : {
              ...t,
              requestId,
              status: "loading",
              error: undefined,
              messages: [...trimmed, { role: "assistant", content: "" }],
            }
      )
    );

    let assistant = "";
    let scheduled = false;
    try {
       await streamChatCompletion({
         model: tab.model.id,
         messages: apiMessages,
         apiKey: undefined,
         signal: controller.signal,
        onDelta: (delta) => {
          assistant += delta;
          if (scheduled) return;
          scheduled = true;
          requestAnimationFrame(() => {
            scheduled = false;
            setTabs((prev) =>
              prev.map((t) =>
                t.tabId !== tabId || t.requestId !== requestId
                  ? t
                  : {
                      ...t,
                      status: "streaming",
                      messages: updateLastAssistant(t.messages, assistant),
                    }
              )
            );
          });
        },
      });

      setTabs((prev) =>
        prev.map((t) =>
          t.tabId !== tabId || t.requestId !== requestId
            ? t
            : {
                ...t,
                status: "done",
                messages: updateLastAssistant(t.messages, assistant),
              }
        )
      );
    } catch (err: unknown) {
      const maybeAbort =
        err &&
        typeof err === "object" &&
        "name" in err &&
        (err as { name?: string }).name === "AbortError";
      if (maybeAbort) return;

      const message = err instanceof Error ? err.message : "Request failed";
      setTabs((prev) =>
        prev.map((t) =>
          t.tabId !== tabId || t.requestId !== requestId ? t : { ...t, status: "error", error: message }
        )
      );
    }
  };

  const handleModelSelect = (tabId: string, model: AIModel) => {
    abortControllers.current[tabId]?.abort();
    abortControllers.current[tabId] = null;
    setTabs((prev) =>
      prev.map((t) =>
        t.tabId !== tabId
          ? t
          : {
              ...t,
              requestId: null,
              model,
              messages: [],
              status: "idle",
              error: undefined,
            }
      )
    );
    setModelPickerTabId(null);
  };

  const handleNewTab = () => {
    if (appMode === "reasoning" && tabs.length >= 5) {
      setBanner("Maximum 5 tabs allowed in Advanced Reasoning mode.");
      return;
    }
    const model = DEFAULT_MODELS[0] ?? DEFAULT_MODELS[DEFAULT_MODELS.length - 1];
    setTabs((prev) => {
      const next = [...prev, createTab(model)];
      setActiveIndex(next.length - 1);
      return next;
    });
  };

  const handleCloseTab = (idx: number) => {
    if (tabs.length <= 1) return;

    const closing = tabs[idx];
    if (closing) {
      abortControllers.current[closing.tabId]?.abort();
      delete abortControllers.current[closing.tabId];
      if (modelPickerTabId === closing.tabId) setModelPickerTabId(null);
    }

    const nextActive =
      activeIndex === idx ? Math.max(0, idx - 1) : activeIndex > idx ? activeIndex - 1 : activeIndex;

    setTabs((prev) => prev.filter((_, i) => i !== idx));
    setActiveIndex(nextActive);
  };

  const handleCloseAllTabs = () => {
    Object.values(abortControllers.current).forEach((c) => c?.abort());
    abortControllers.current = {};
    setModelPickerTabId(null);
    setTabs(() => [createTab(DEFAULT_MODELS[0] ?? DEFAULT_MODELS[DEFAULT_MODELS.length - 1])]);
    setActiveIndex(0);
  };

  if (!authLoaded) {
    return <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", color: "#fff" }}>Loading...</div>;
  }

  const sidebarHistory = chatHistory.map(chat => {
    const firstUserMsg = chat.messages.find(m => m.role === "user")?.content;
    const title = firstUserMsg ? (firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '...' : firstUserMsg) : "New Chat";
    return {
      id: chat.tabId,
      title,
      modelName: chat.model.name,
    };
  });

  return (
    <div className={styles.app}>
      <Sidebar
        username={username}
        onLogout={handleLogout}
        history={sidebarHistory}
        onChatSelect={handleChatSelect}
        appMode={appMode}
        onAppModeChange={(mode) => setAppMode(mode)}
      />

      <div className={styles.main}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.title}>
                <h1>{appMode === "normal" ? "Chat" : "Advanced Reasoning"}</h1>
                <p>{appMode === "normal" ? "Use Chrome-style tabs to switch models and chats." : "Multi-AI Debate & Synthesis Environment"}</p>
              </div>

              {banner && (
                <div className={styles.banner}>
                  <span>{banner}</span>
                  <button className={styles.bannerClose} onClick={() => setBanner(null)} title="Dismiss">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

             <div className={styles.headerRight}>
               </div>
          </header>

          <div className={styles.tabBar}>
            <div className={styles.tabList}>
              {tabs.map((t, i) => {
                const color = getProviderColor(t.model.provider);
                const isActive = activeIndex === i;
                return (
                  <button
                    key={t.tabId}
                    className={`${styles.chromeTab} ${isActive ? styles.chromeTabActive : ""}`}
                    onClick={() => setActiveIndex(i)}
                    title={t.model.id}
                    style={isActive ? ({ "--tab-accent": color } as React.CSSProperties) : undefined}
                  >
                    <span className={styles.chromeTabDot} style={{ background: color }} />
                    <span className={styles.chromeTabLabel}>{t.model.name}</span>
                    <span className={styles.chromeTabSpacer} />
                    <span
                      className={`${styles.chromeTabClose} ${tabs.length <= 1 ? styles.chromeTabCloseDisabled : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseTab(i);
                      }}
                      role="button"
                      aria-label="Close tab"
                      title={tabs.length <= 1 ? "At least one tab must remain" : "Close tab"}
                    >
                      <X size={14} />
                    </span>
                  </button>
                );
              })}

              <button className={styles.newTabBtn} onClick={handleNewTab} title="New tab">
                <Plus size={16} />
              </button>
            </div>

            <button
              className={`${styles.closeAllBtn} ${tabs.length <= 1 ? styles.closeAllBtnDisabled : ""}`}
              onClick={handleCloseAllTabs}
              disabled={tabs.length <= 1}
              title={tabs.length <= 1 ? "Only one tab open" : "Close all tabs (keeps one)"}
            >
              Close all
            </button>
          </div>

          <div className={styles.panels}>
            {appMode === "reasoning" ? (
              <ReasoningPanel
                steps={reasoningSteps}
                result={reasoningResult}
                error={reasoningError}
                isRunning={isReasoningRunning}
                currentStep={currentReasoningStep}
                liveLogs={liveLogs}
              />
            ) : (
              tabs.map((t, i) => (
                <ChatPanel
                  key={t.tabId}
                  panel={t}
                  isActive={activeIndex === i}
                  onActivate={() => setActiveIndex(i)}
                  onRetry={() => handleRetry(t.tabId)}
                  onModelClick={() => setModelPickerTabId(t.tabId)}
                />
              ))
            )}
          </div>

      <PromptInput
        onSend={handleSend}
      />
        </div>
        {appMode === "normal" && <RightPanel />}
      </div>

      {modelPickerTabId !== null && (
        <div className={styles.modalOverlay} onMouseDown={() => setModelPickerTabId(null)}>
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <strong>Select model</strong>
                <span className={styles.modalSub}>
                  {(() => {
                    const idx = tabs.findIndex((t) => t.tabId === modelPickerTabId);
                    return idx >= 0 ? `Tab #${idx + 1}` : "";
                  })()}
                </span>
              </div>
              <button className={styles.modalClose} onClick={() => setModelPickerTabId(null)} title="Close">
                <X size={16} />
              </button>
            </div>
            <ModelSelector
              selectedModel={tabs.find((t) => t.tabId === modelPickerTabId)?.model ?? null}
              onSelect={(m) => {
                if (!modelPickerTabId) return;
                handleModelSelect(modelPickerTabId, m);
              }}
              placeholder="Search 400+ models..."
            />
            <div className={styles.modalHint}>
              Switching models clears the tab conversation (for now).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
