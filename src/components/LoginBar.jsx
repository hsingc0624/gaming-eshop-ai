import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import styles from "./LoginBar.module.css";

export default function LoginBar() {
  const { user, login, logout, loading } = useAuthContext();
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login(email, password);
      setError("");
    } catch {
      setError("Login failed");
    }
  }

  if (loading) return <p className={styles.loading}>Loading...</p>;

  if (user) {
    return (
      <div className={styles.container}>
        <span className={styles.user}>Hi, {user.name || "User"}</span>
        <button className={`${styles.btn} ${styles.logout}`} onClick={logout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <form className={styles.container} onSubmit={handleLogin}>
      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className={`${styles.btn} ${styles.login}`}
        type="submit"
        disabled={loading}
      >
        {loading ? "…" : "Login"}
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </form>
  );
}
