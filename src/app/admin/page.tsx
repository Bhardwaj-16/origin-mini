"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) {
      router.push("/admin/login");
    } else {
      setToken(t);
    }
  }, [router]);

  // @ts-ignore
  const user = useQuery(api.auth.getSessionUser, token ? { token } : "skip");
  // @ts-ignore
  const configs = useQuery(api.config.getApiConfigs, token ? { token } : "skip");
  // @ts-ignore
  const setApiConfig = useMutation(api.config.setApiConfig);
  // @ts-ignore
  const logout = useMutation(api.auth.logout);

  const [activeTab, setActiveTab] = useState<"featured" | "all">("featured");
  const [apiProvider, setApiProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (configs) {
      const current = configs.find((c: any) => c.mode === activeTab);
      if (current) {
        setApiProvider(current.apiProvider || "");
        setApiKey(current.apiKey || "");
        setBaseUrl(current.baseUrl || "");
      } else {
        setApiProvider(activeTab === "featured" ? "openrouter" : "hackclub");
        setApiKey("");
        setBaseUrl(activeTab === "featured" ? "https://openrouter.ai/api/v1" : "https://ai.hackclub.com/proxy/v1");
      }
    }
  }, [configs, activeTab]);

  if (!token) return null;
  if (user === undefined || configs === undefined) {
    return <div style={{ color: "white" }}>Loading dashboard...</div>;
  }
  if (user === null) {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      await setApiConfig({
        token,
        mode: activeTab,
        apiProvider,
        apiKey,
        baseUrl,
      });
      setSuccess("Configuration saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout({ token });
    } catch (e) {}
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>API Configuration</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout ({user.email})
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "featured" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("featured")}
        >
          Featured Models
        </button>
        <button
          className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Models
        </button>
      </div>

      <div className={styles.configCard}>
        <h2 className={styles.configTitle}>
          {activeTab === "featured" ? "Featured API Settings" : "All Models API Settings"}
        </h2>
        
        {success && <div className={styles.successMsg}>{success}</div>}
        
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label className={styles.label}>API Provider Name</label>
            <input
              type="text"
              className={styles.input}
              value={apiProvider}
              onChange={(e) => setApiProvider(e.target.value)}
              placeholder="e.g. openrouter, hackclub"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Base URL</label>
            <input
              type="url"
              className={styles.input}
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://openrouter.ai/api/v1"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>API Key</label>
            <input
              type="password"
              className={styles.input}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              required
            />
          </div>

          <button type="submit" className={styles.button} disabled={saving}>
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </form>
      </div>
    </div>
  );
}
