"use client";

import { useEffect, useState } from "react";
import styles from "./MobileWarning.module.css";

export default function MobileWarning() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>⚠️</div>
        <h2 className={styles.title}>Mobile Not Supported</h2>
        <p className={styles.message}>
          This site isn't supported on mobile phones. Please use a laptop or a desktop if possible.
          Desktop site could also be used but it's still in Beta testing.
        </p>
        <button className={styles.button} onClick={() => setDismissed(true)}>
          I Understand, Continue Anyway
        </button>
      </div>
    </div>
  );
}
