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
}

export default function Sidebar({ username, onLogout, history = [], onChatSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
      {/* Logo / Toggle */}
      <button
        className={styles.logoToggle}
        onClick={() => setCollapsed(v => !v)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className={styles.logoIcon}>
          <Layers size={20} />
        </div>
        {!collapsed && (
          <div className={styles.logoText}>
            <span className={styles.logoName}>ORIGIN</span>
            <span className={styles.logoSub}>mini</span>
          </div>
        )}
        {!collapsed && (
          <span className={styles.collapseBtnInner}>
            <Menu size={14} />
          </span>
        )}
      </button>

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
