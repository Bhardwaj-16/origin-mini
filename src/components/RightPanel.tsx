"use client";

import { useEffect, useState } from "react";
import { Clock, MessageCircle } from "lucide-react";
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

      <div className={styles.section} style={{ marginTop: "auto" }}>
        <button 
          className={styles.feedbackBtn} 
          onClick={() => window.open("https://forms.gle/7dacJzrP4f2SBKpMA", "_blank")}
        >
          <MessageCircle size={16} />
          Feedback Form
        </button>
      </div>
    </aside>
  );
}
