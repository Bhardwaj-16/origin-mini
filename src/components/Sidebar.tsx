"use client";

import { Layers, MessageSquare, Code2, Network, Settings, ChevronRight, Sparkles, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import styles from "./Sidebar.module.css";
import type { ChatMode } from "./PromptInput";

export interface ChatHistoryItem {
  id: string;
  title: string;
  modelName: string;
}

interface SidebarProps {
  activeMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  username?: string | null;
  onLogout?: () => void;
  history?: ChatHistoryItem[];
  onChatSelect?: (id: string) => void;
}

const NAV_ITEMS = [
  { id: "general" as ChatMode, icon: <MessageSquare size={18} />, label: "Multi-Chat", desc: "Chat with 5 AIs at once" },
  { id: "reasoning" as ChatMode, icon: <Sparkles size={18} />, label: "Advanced Reasoning", desc: "Multi-AI debate & synthesis", badge: "⚡ Flagship" },
  { id: "codo" as ChatMode, icon: <Code2 size={18} />, label: "Codo Mode", desc: "AI-powered code generation", badge: "🔥 Hot" },
  { id: "swarm" as ChatMode, icon: <Network size={18} />, label: "Agent Swarm", desc: "Autonomous web research" },
];

export default function Sidebar({ activeMode, onModeChange, username, onLogout, history = [], onChatSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Layers size={20} />
        </div>
        {!collapsed && (
          <div className={styles.logoText}>
            <span className={styles.logoName}>ORIGIN</span>
            <span className={styles.logoSub}>mini</span>
          </div>
        )}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(v => !v)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight size={14} /> : <Menu size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {!collapsed && <div className={styles.navLabel}>Modes</div>}
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            id={`sidebar-${item.id}`}
            className={`${styles.navItem} ${activeMode === item.id ? styles.navItemActive : ""}`}
            onClick={() => onModeChange(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && (
              <div className={styles.navContent}>
                <div className={styles.navItemTop}>
                  <span className={styles.navLabel2}>{item.label}</span>
                  {item.badge && <span className={styles.badge}>{item.badge}</span>}
                </div>
                <span className={styles.navDesc}>{item.desc}</span>
              </div>
            )}
            {!collapsed && activeMode === item.id && (
              <ChevronRight size={12} className={styles.activeArrow} />
            )}
          </button>
        ))}
      </nav>

      {/* History */}
      <div className={styles.history}>
        {!collapsed && <div className={styles.navLabel}>Recent Chats</div>}
        <div className={styles.historyList}>
          {history.length === 0 && !collapsed && (
            <div className={styles.emptyHistory}>No recent chats</div>
          )}
          {history.map(chat => (
            <button 
              key={chat.id} 
              className={styles.historyItem}
              onClick={() => onChatSelect?.(chat.id)}
              title={collapsed ? chat.title : undefined}
            >
              <MessageSquare size={14} className={styles.historyIcon} />
              {!collapsed && (
                <div className={styles.historyContent}>
                  <span className={styles.historyTitle}>{chat.title}</span>
                  <span className={styles.historyModel}>{chat.modelName}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div className={styles.bottom}>
        {username && (
          <div className={styles.userSection} title={username}>
            <User size={16} />
            {!collapsed && <span className={styles.username}>{username}</span>}
          </div>
        )}
        <button className={styles.settingsBtn} onClick={onLogout} title="Logout">
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
