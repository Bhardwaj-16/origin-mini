"use client";

import { useEffect, useState } from "react";
import { Clock, MessageCircle, Activity } from "lucide-react";
import styles from "./RightPanel.module.css";

export default function RightPanel() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <aside className={styles.rightPanel}>
      <div className={styles.panelHeader}>
        PROJECT CONTEXT
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Clock size={16} className={styles.sectionIcon} />
          Current Time
        </div>
        <div className={styles.timeBox}>
          <span className={styles.timeText}>{formatTime(time)}</span>
          <span className={styles.dateText}>{formatDate(time)}</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Activity size={16} className={styles.sectionIcon} />
          Active Session
        </div>
        <div className={styles.sessionCard}>
          <div className={styles.sessionHeader}>Metrics</div>
          <div className={styles.sessionRow}>
            <span className={styles.sessionLabel}>Duration</span>
            <span className={styles.sessionValue}>02:45:12</span>
          </div>
          <div className={styles.sessionRow}>
            <span className={styles.sessionLabel}>Compute Load</span>
            <span className={`${styles.sessionValue} ${styles.sessionHighlight}`}>MEDIUM</span>
          </div>
        </div>
      </div>

      <div className={styles.section} style={{ marginTop: "auto" }}>
        <button 
          className={styles.feedbackBtn} 
          onClick={() => alert("Feedback form opening soon")}
        >
          <MessageCircle size={16} />
          Feedback form (Coming soon)
        </button>
      </div>
    </aside>
  );
}
