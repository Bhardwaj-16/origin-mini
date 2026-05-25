"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  Send, Sparkles, Code2, Network, Mic, Paperclip, Zap, ChevronRight
} from "lucide-react";
import styles from "./PromptInput.module.css";

export type ChatMode = "general" | "reasoning" | "codo" | "swarm";

interface PromptInputProps {
  onSend: (prompt: string, mode: ChatMode) => void;
  disabled?: boolean;
  activeMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const MODES: { id: ChatMode; label: string; icon: React.ReactNode; desc: string; gradient: string }[] = [
  {
    id: "general",
    label: "General",
    icon: <Sparkles size={14} />,
    desc: "Chat with all selected models simultaneously",
    gradient: "linear-gradient(135deg,#f97316,#f59e0b)",
  },
  {
    id: "reasoning",
    label: "Reasoning",
    icon: <Zap size={14} />,
    desc: "Multi-AI debate for accurate, hallucination-free answers",
    gradient: "linear-gradient(135deg,#f59e0b,#ef4444)",
  },
  {
    id: "codo",
    label: "Codo",
    icon: <Code2 size={14} />,
    desc: "Multiple AIs generate, review and test your code",
    gradient: "linear-gradient(135deg,#10b981,#06b6d4)",
  },
  {
    id: "swarm",
    label: "Swarm",
    icon: <Network size={14} />,
    desc: "Multi-agent web research and data gathering",
    gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)",
  },
];

const SUGGESTIONS = [
  "Explain quantum entanglement in simple terms",
  "Write a Python function to parse JSON with error handling",
  "Compare the latest LLM architectures: pros and cons",
  "Debug this React hook that causes infinite re-renders",
  "Summarize the latest AI research papers from 2025",
];

export default function PromptInput({ onSend, disabled, activeMode, onModeChange }: PromptInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentMode = MODES.find(m => m.id === activeMode)!;

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed, activeMode);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = value.length;
  const isOverLimit = charCount > 4000;

  return (
    <div className={styles.container}>
      {/* Mode selector row */}
      <div className={styles.modeRow}>
        {MODES.map(mode => (
          <button
            key={mode.id}
            id={`mode-btn-${mode.id}`}
            className={`${styles.modeChip} ${activeMode === mode.id ? styles.modeChipActive : ""}`}
            onClick={() => onModeChange(mode.id)}
            style={activeMode === mode.id ? { "--mode-gradient": mode.gradient } as React.CSSProperties : {}}
            title={mode.desc}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}

        <div className={styles.modeSpacer} />

        <div className={styles.modeHint}>
          <ChevronRight size={12} />
          <span>{currentMode.desc}</span>
        </div>
      </div>

      {/* Input box */}
      <div className={`${styles.inputBox} ${disabled ? styles.inputBoxDisabled : ""}`}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="prompt-textarea"
          className={styles.textarea}
          placeholder={
            activeMode === "reasoning"
              ? "Ask a complex question — multiple AIs will debate and converge on the best answer..."
              : activeMode === "codo"
              ? "Describe what you want to build or fix..."
              : activeMode === "swarm"
              ? "What should the agent swarm research or gather?"
              : "Send a message to all open tabs..."
          }
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          maxLength={6000}
        />

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.leftActions}>
            <button className={styles.attachBtn} title="Attach file" disabled>
              <Paperclip size={15} />
            </button>
            <button className={styles.attachBtn} title="Voice input" disabled>
              <Mic size={15} />
            </button>
            {charCount > 0 && (
              <span className={`${styles.charCount} ${isOverLimit ? styles.charCountOver : ""}`}>
                {charCount.toLocaleString()} / 6,000
              </span>
            )}
          </div>

          <div className={styles.rightActions}>
            <span className={styles.shortcutHint}>↵ Send · ⇧↵ New line</span>
            <button
              id="send-button"
              className={`${styles.sendBtn} ${value.trim() && !disabled ? styles.sendBtnActive : ""}`}
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              title="Send message"
            >
              <Send size={15} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions (when empty) */}
      {value.trim() === "" && (
        <div className={styles.suggestions}>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              className={styles.suggestionChip}
              onClick={() => setValue(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
