"use client";

import { CheckCircle2, Loader2, ChevronDown, ChevronRight, Zap, Brain, GitMerge, Sparkles } from "lucide-react";
import { useState } from "react";
import styles from "./ReasoningPanel.module.css";

export interface ReasoningStep {
  step: number;
  label: string;
  restructuredPrompt?: string;
  answers?: { model: string; content: string }[];
  critiques?: { model: string; critique: string }[];
}

export interface ReasoningResult {
  finalAnswer: string;
  restructuredPrompt: string;
  models: string[];
  answers: { model: string; content: string }[];
  critiques: { model: string; critique: string }[];
}

interface ReasoningPanelProps {
  steps: ReasoningStep[];
  result: ReasoningResult | null;
  error: string | null;
  isRunning: boolean;
  currentStep: number;
}

const STEP_ICONS = [
  <Sparkles size={14} key="1" />,
  <Brain size={14} key="2" />,
  <GitMerge size={14} key="3" />,
  <Zap size={14} key="4" />,
];

const STEP_LABELS = [
  "Restructuring Prompt",
  "Gathering Perspectives",
  "Cross-Critiquing",
  "Synthesizing Answer",
];

function CollapsibleSection({ title, children, defaultOpen = false }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.collapsible}>
      <button className={styles.collapsibleBtn} onClick={() => setOpen(v => !v)}>
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        <span>{title}</span>
      </button>
      {open && <div className={styles.collapsibleBody}>{children}</div>}
    </div>
  );
}

function renderMarkdown(text: string): string {
  return text
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code>${escHtml(code.trim())}</code></pre>`
    )
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
    .replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>(\n|$))+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n+/g, "</p><p>")
    .replace(/^(?!<[a-z])(.+)$/gm, l => l.startsWith("<") ? l : `<p>${l}</p>`);
}
function escHtml(t: string) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function ReasoningPanel({ steps, result, error, isRunning, currentStep }: ReasoningPanelProps) {
  if (!isRunning && steps.length === 0 && !result && !error) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <Zap size={32} />
        </div>
        <h3>Advanced Reasoning Mode</h3>
        <p>
          Multiple AI models will debate your question internally, cross-critique each other&apos;s answers,
          and converge on the most accurate, hallucination-free response.
        </p>
        <div className={styles.pipeline}>
          {STEP_LABELS.map((label, i) => (
            <div key={i} className={styles.pipelineStep}>
              <div className={styles.pipelineIcon}>{STEP_ICONS[i]}</div>
              <span>{label}</span>
              {i < STEP_LABELS.length - 1 && <ChevronRight size={12} className={styles.pipelineArrow} />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      {/* Progress Steps */}
      <div className={styles.progressHeader}>
        <div className={styles.progressSteps}>
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isDone = currentStep > stepNum || result !== null;
            const isActive = currentStep === stepNum && isRunning;
            return (
              <div key={i} className={`${styles.stepItem} ${isDone ? styles.stepDone : ""} ${isActive ? styles.stepActive : ""}`}>
                <div className={styles.stepCircle}>
                  {isDone
                    ? <CheckCircle2 size={12} />
                    : isActive
                    ? <Loader2 size={12} className={styles.spin} />
                    : <span>{stepNum}</span>}
                </div>
                <span className={styles.stepLabel}>{label}</span>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`${styles.stepConnector} ${isDone ? styles.stepConnectorDone : ""}`} />
                )}
              </div>
            );
          })}
        </div>
        {isRunning && (
          <div className={styles.runningBadge}>
            <Loader2 size={11} className={styles.spin} />
            <span>Running debate…</span>
          </div>
        )}
      </div>

      {/* Live step labels */}
      {steps.length > 0 && (
        <div className={styles.stepLog}>
          {steps.map((s, i) => (
            <div key={i} className={styles.stepLogItem}>
              <CheckCircle2 size={11} className={styles.logCheck} />
              <span>{s.label}</span>
            </div>
          ))}
          {isRunning && (
            <div className={styles.stepLogItem}>
              <Loader2 size={11} className={`${styles.spin} ${styles.logSpinner}`} />
              <span>Processing…</span>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className={styles.errorBox}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className={styles.results}>
          {/* Restructured prompt */}
          {result.restructuredPrompt && (
            <CollapsibleSection title="🔧 Restructured Prompt">
              <div className={styles.quoteBlock}>{result.restructuredPrompt}</div>
            </CollapsibleSection>
          )}

          {/* Individual model answers */}
          {result.answers.length > 0 && (
            <CollapsibleSection title={`🧠 ${result.answers.length} Model Perspectives`}>
              <div className={styles.modelAnswers}>
                {result.answers.map((a, i) => (
                  <div key={i} className={styles.modelAnswer}>
                    <div className={styles.modelAnswerHeader}>
                      <div className={styles.modelDot} />
                      <span className={styles.modelAnswerName}>{a.model}</span>
                    </div>
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(a.content) }}
                      style={{ fontSize: "0.8rem" }}
                    />
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Critiques */}
          {result.critiques.length > 0 && (
            <CollapsibleSection title="⚔️ Cross-Critique Analysis">
              <div className={styles.modelAnswers}>
                {result.critiques.map((c, i) => (
                  <div key={i} className={styles.modelAnswer}>
                    <div className={styles.modelAnswerHeader}>
                      <div className={styles.modelDot} style={{ background: "#f59e0b" }} />
                      <span className={styles.modelAnswerName}>{c.model}</span>
                    </div>
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(c.critique) }}
                      style={{ fontSize: "0.8rem" }}
                    />
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Final Answer — always expanded */}
          <div className={styles.finalAnswer}>
            <div className={styles.finalHeader}>
              <Zap size={16} className={styles.finalIcon} />
              <span>Synthesized Final Answer</span>
              <div className={styles.finalBadge}>Hallucination-Resistant</div>
            </div>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(result.finalAnswer) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
