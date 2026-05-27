import { ReactNode } from "react";
import styles from "./admin.module.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.adminLayout}>
      <header className={styles.header}>
        <div className={styles.logo}>ORIGIN Admin</div>
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
