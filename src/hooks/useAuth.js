import { useEffect, useState } from "react";
import { api, csrf } from "../lib/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await api.get("/api/user");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  async function login(email, password) {
    await csrf();
    const { data } = await api.post("/api/auth/login", { email, password });
    setUser(data.user ?? data);
  }

  async function logout() {
    await api.post("/api/auth/logout");
    setUser(null);
  }

  return { user, loading, login, logout };
}
