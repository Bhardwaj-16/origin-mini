"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/auth.module.css";

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "An error occurred");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        <p>{mode === "login" ? "Log in to continue chatting" : "Join Origin Mini today"}</p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit">{mode === "login" ? "Login" : "Sign Up"}</button>
        </form>
        
        <p className={styles.footer}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button 
            className={styles.link} 
            onClick={() => router.push(mode === "login" ? "/signup" : "/login")}
          >
            {mode === "login" ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
