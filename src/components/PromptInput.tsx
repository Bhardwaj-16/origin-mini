"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  Send, Mic, Paperclip
} from "lucide-react";
import styles from "./PromptInput.module.css";

export type ChatMode = "general";

interface PromptInputProps {
  onSend: (prompt: string, mode: ChatMode) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "Explain quantum entanglement in simple terms",
  "Write a Python function to parse JSON with error handling",
  "Compare the latest LLM architectures: pros and cons",
  "Debug this React hook that causes infinite re-renders",
  "Summarize the latest AI research papers from 2025",
];

export default function PromptInput({ onSend, disabled }: PromptInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    onSend(trimmed, "general");
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
      {/* Input box */}
      <div className={`${styles.inputBox} ${disabled ? styles.inputBoxDisabled : ""}`}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="prompt-textarea"
          className={styles.textarea}
          placeholder="Send a message to all open tabs..."
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
