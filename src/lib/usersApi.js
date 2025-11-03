import { api } from "./api";

export async function fetchUsers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.role) params.set("role", filters.role);
  if (filters.status) params.set("status", filters.status);
  const { data } = await api.get(`/api/admin/users?${params.toString()}`);
  return data?.data ?? data ?? [];
}

export async function fetchRoles() {
  const { data } = await api.get("/api/admin/roles");
  return Array.isArray(data) ? data : [];
}

export async function updateUserRole(id, role) {
  const { data } = await api.patch(`/api/admin/users/${id}`, { role });
  return data;
}

export async function updateUserActive(id, is_active) {
  const { data } = await api.patch(`/api/admin/users/${id}`, { is_active });
  return data;
}

export async function createUser(payload) {
  const { data } = await api.post("/api/admin/users", payload);
  return data;
}
