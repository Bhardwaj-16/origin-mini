"use client";

import { useRef, useEffect } from "react";
import { Copy, RotateCcw, CheckCircle2, AlertCircle, Loader2, Zap } from "lucide-react";
import { AIModel, getProviderColor } from "@/lib/models";
import styles from "./ChatPanel.module.css";

export type MessageStatus = "idle" | "loading" | "streaming" | "done" | "error";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface PanelState {
  model: AIModel;
  messages: ChatMessage[];
  status: MessageStatus;
  error?: string;
}

interface ChatPanelProps {
  panel: PanelState;
  isActive: boolean;
  onActivate: () => void;
  onRetry: () => void;
  onModelClick: () => void;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="language-${lang || "text"}">${escapeHtml(code.trim())}</code></pre>`
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
    .replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[a-z])(.+)$/gm, (line) => {
      if (!line.trim()) return "";
      if (line.startsWith("<")) return line;
      return `<p>${line}</p>`;
    });
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function ChatPanel({
  panel,
  isActive,
  onActivate,
  onRetry,
  onModelClick,
}: ChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const color = getProviderColor(panel.model.provider);

  useEffect(() => {
    if (panel.status === "streaming") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [panel.messages, panel.status]);

  const lastAssistantMsg = [...panel.messages].reverse().find(m => m.role === "assistant");

  const handleCopy = async () => {
    if (lastAssistantMsg?.content) {
      await navigator.clipboard.writeText(lastAssistantMsg.content);
    }
  };

  return (
    <div
      className={`${styles.panel} ${isActive ? styles.panelActive : ""}`}
      onClick={onActivate}
      style={{ "--provider-color": color } as React.CSSProperties}
    >
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.modelBtn} onClick={(e) => { e.stopPropagation(); onModelClick(); }}>
          <span className={styles.providerDot} style={{ background: color }} />
          <div className={styles.modelInfo}>
            <span className={styles.modelName}>{panel.model.name}</span>
            <span className={styles.contextLen}>{panel.model.contextLength} ctx</span>
          </div>
        </button>

        <div className={styles.headerActions}>
          {panel.status === "done" && lastAssistantMsg && (
            <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); handleCopy(); }} title="Copy response">
              <Copy size={13} />
            </button>
          )}
          {panel.status === "error" && (
            <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); onRetry(); }} title="Retry">
              <RotateCcw size={13} />
            </button>
          )}
          {/* Status indicator */}
          <div className={styles.statusBadge}>
            {panel.status === "loading" && (
              <><Loader2 size={11} className={styles.spin} /><span>Thinking</span></>
            )}
            {panel.status === "streaming" && (
              <><span className={styles.streamDot} /><span>Streaming</span></>
            )}
            {panel.status === "done" && (
              <><CheckCircle2 size={11} className={styles.doneIcon} /><span>Done</span></>
            )}
            {panel.status === "error" && (
              <><AlertCircle size={11} className={styles.errorIcon} /><span>Error</span></>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Empty state */}
        {panel.messages.length === 0 && panel.status === "idle" && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconBox}>
              <Zap size={24} color="#f97316" />
            </div>
            <h2>Collaborative Intelligence</h2>
            <p>Ready to assist with advanced reasoning, technical analysis, and multi-modal creative workflows.</p>
          </div>
        )}

        {/* Loading / typing */}
        {panel.status === "loading" && panel.messages.filter(m => m.role === "assistant").length === 0 && (
          <div className={styles.typingWrapper}>
            <div className={styles.typingBubble}>
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {panel.messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${msg.role === "user" ? styles.userMsg : styles.assistantMsg}`}
          >
            {msg.role === "assistant" ? (
              <div
                className={`prose ${styles.assistantContent} ${panel.status === "streaming" && i === panel.messages.length - 1 ? "stream-cursor" : ""}`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
              />
            ) : (
              <div className={styles.userContent}>{msg.content}</div>
            )}
          </div>
        ))}

        {/* Error */}
        {panel.status === "error" && (
          <div className={styles.errorMsg}>
            <AlertCircle size={14} />
            <span>{panel.error ?? "An error occurred. Click retry."}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Active glow border */}
      {isActive && (
        <div className={styles.activeBorder} style={{ background: color }} />
      )}
    </div>
  );
}
