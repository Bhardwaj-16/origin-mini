"use client";

import { Layers, MessageSquare, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import styles from "./Sidebar.module.css";

export interface ChatHistoryItem {
  id: string;
  title: string;
  modelName: string;
}

interface SidebarProps {
  username?: string | null;
  onLogout?: () => void;
  history?: ChatHistoryItem[];
  onChatSelect?: (id: string) => void;
  appMode?: "normal" | "reasoning";
  onAppModeChange?: (mode: "normal" | "reasoning") => void;
}

export default function Sidebar({ username, onLogout, history = [], onChatSelect, appMode = "normal", onAppModeChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
      <button
        className={styles.logoToggle}
        onClick={() => setCollapsed(v => !v)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className={styles.logoContainer}>
          {collapsed ? (
            <div className={styles.logoIcon}>
              <img src="/logo.png" className={styles.logoImgCollapsed} alt="O" />
            </div>
          ) : (
            <div className={styles.logoWrapper}>
              <img src="/logo.png" className={styles.logoImgExpanded} alt="ORIGIN" />
              <span className={styles.logoSub}>mini</span>
            </div>
          )}
        </div>
        {!collapsed && (
          <span className={styles.collapseBtnInner}>
            <Menu size={14} />
          </span>
        )}
      </button>

      {/* Main Modes */}
      <div className={styles.nav}>
        {!collapsed && <div className={styles.navLabel}>Modes</div>}
        <button
          className={`${styles.navItem} ${appMode === "normal" ? styles.navItemActive : ""}`}
          onClick={() => onAppModeChange?.("normal")}
          title={collapsed ? "Chat" : undefined}
        >
          <MessageSquare size={16} className={styles.navIcon} />
          {!collapsed && (
            <div className={styles.navContent}>
              <span className={styles.navLabel2}>Chat</span>
              <span className={styles.navDesc}>Standard AI models</span>
            </div>
          )}
        </button>
        <button
          className={`${styles.navItem} ${appMode === "reasoning" ? styles.navItemActive : ""}`}
          onClick={() => onAppModeChange?.("reasoning")}
          title={collapsed ? "Advanced Reasoning" : undefined}
        >
          <Layers size={16} className={styles.navIcon} />
          {!collapsed && (
            <div className={styles.navContent}>
              <span className={styles.navLabel2}>Advanced Reasoning</span>
              <span className={styles.navDesc}>Multi-AI debate</span>
            </div>
          )}
        </button>
      </div>

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
