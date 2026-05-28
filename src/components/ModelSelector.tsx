"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Check, ChevronDown, Zap, Code2, Globe, Sparkles } from "lucide-react";
import { MODELS, FEATURED_MODELS, OPENROUTER_FREE_MODELS, AIModel, getProviderColor, isFeaturedModel, isOpenRouterFreeModel } from "@/lib/models";
import styles from "./ModelSelector.module.css";

interface ModelSelectorProps {
  selectedModel: AIModel | null;
  onSelect: (model: AIModel) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TAGS = ["All", "reasoning", "code", "search"];

export default function ModelSelector({
  selectedModel,
  onSelect,
  placeholder = "Select a model",
  disabled = false,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<"Featured" | "OpenRouter" | "All">("Featured");
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("All");
  const [tag, setTag] = useState("All");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const baseModels = scope === "Featured" ? FEATURED_MODELS : scope === "OpenRouter" ? OPENROUTER_FREE_MODELS : MODELS;
  const providers = ["All", ...Array.from(new Set(baseModels.map((m) => m.provider))).sort()];

  const filtered = baseModels.filter(m => {
    const matchSearch =
      search.trim() === "" ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    const matchProvider = provider === "All" || m.provider === provider;
    const matchTag = tag === "All" || m.tags?.includes(tag);
    return matchSearch && matchProvider && matchTag;
  });

  const providerColor = selectedModel ? getProviderColor(selectedModel.provider) : "var(--text-secondary)";

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={`${styles.trigger} ${open ? styles.triggerOpen : ""} ${disabled ? styles.disabled : ""}`}
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selectedModel ? (
          <span className={styles.triggerContent}>
            <span
              className={styles.providerDot}
              style={{ background: providerColor }}
            />
            <span className={styles.modelName}>{selectedModel.name}</span>
            <span className={styles.contextBadge}>{selectedModel.contextLength}</span>
          </span>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <ChevronDown
          size={14}
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
        />
      </button>

      {open && (
        <div className={styles.dropdown} role="listbox">
          {/* Scope */}
            <div className={styles.scopeRow}>
              <button
                className={`${styles.scopeTab} ${scope === "Featured" ? styles.scopeTabActive : ""}`}
                onClick={() => {
                  setScope("Featured");
                  setProvider("All");
                  setTag("All");
                }}
                type="button"
              >
                Featured
              </button>
              <button
                className={`${styles.scopeTab} ${scope === "OpenRouter" ? styles.scopeTabActive : ""}`}
                onClick={() => {
                  setScope("OpenRouter");
                  setProvider("All");
                  setTag("All");
                }}
                type="button"
              >
                <Sparkles size={12} /> Free
              </button>
              <button
                className={`${styles.scopeTab} ${scope === "All" ? styles.scopeTabActive : ""}`}
                onClick={() => {
                  setScope("All");
                  setProvider("All");
                  setTag("All");
                }}
                type="button"
              >
                All models
              </button>
            </div>

          {/* Search */}
          <div className={styles.searchBar}>
            <Search size={14} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search models..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearBtn} onClick={() => setSearch("")}>
                <X size={12} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              {TAGS.map(t => (
                <button
                  key={t}
                  className={`${styles.filterChip} ${tag === t ? styles.filterChipActive : ""}`}
                  onClick={() => setTag(t)}
                >
                  {t === "reasoning" && <Zap size={10} />}
                  {t === "code" && <Code2 size={10} />}
                  {t === "search" && <Globe size={10} />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Provider scroll */}
          <div className={styles.providerScroll}>
            {providers.slice(0, 12).map(p => (
              <button
                key={p}
                className={`${styles.providerChip} ${provider === p ? styles.providerChipActive : ""}`}
                onClick={() => setProvider(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Model list */}
          <div className={styles.list}>
            {filtered.length === 0 ? (
              <div className={styles.empty}>No models found</div>
            ) : (
              filtered.map(model => (
                <button
                  key={model.id}
                  className={`${styles.option} ${selectedModel?.id === model.id ? styles.optionSelected : ""}`}
                  onClick={() => {
                    onSelect(model);
                    setOpen(false);
                    setSearch("");
                  }}
                  role="option"
                  aria-selected={selectedModel?.id === model.id}
                >
                  <span
                    className={styles.dot}
                    style={{ background: getProviderColor(model.provider) }}
                  />
                  <span className={styles.optionContent}>
                    <span className={styles.optionName}>{model.name}</span>
                    <span className={styles.optionMeta}>
                      {model.provider} · {model.contextLength}
                      {model.isFree && <span className={styles.freeBadge}>FREE</span>}
                    </span>
                  </span>
                  {isFeaturedModel(model.id) && !isOpenRouterFreeModel(model.id) && <span className={styles.featuredBadge}>FEATURED</span>}
              {isOpenRouterFreeModel(model.id) && <span className={styles.freeBadge}>FREE</span>}
                  {model.tags?.map(t => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                  {selectedModel?.id === model.id && (
                    <Check size={14} className={styles.checkIcon} />
                  )}
                </button>
              ))
            )}
          </div>
          <div className={styles.footer}>
            {scope === "Featured" ? `${FEATURED_MODELS.length} featured models` : scope === "OpenRouter" ? `${OPENROUTER_FREE_MODELS.length} free models` : `${MODELS.length} models available`}
          </div>
        </div>
      )}
    </div>
  );
}
