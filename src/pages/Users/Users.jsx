import { useEffect, useMemo, useState } from "react";
import styles from "./Users.module.css";
import {
  fetchUsers,
  fetchRoles,
  updateUserRole,
  updateUserActive,
  createUser,
} from "../../lib/usersApi";
import UsersFilters from "../../components/users/UsersFilters";
import UserRow from "../../components/users/UserRow";
import CreateUserModal from "../../components/users/CreateUserModal";
import { useAuthErrorHandler } from "../../hooks/useAuthErrorHandler";

export default function Users() {
  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState(["Admin", "Staff", "Viewer"]);
  const [filters, setFilters] = useState({ role: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [creatingOpen, setCreatingOpen] = useState(false);

  const handleAuthError = useAuthErrorHandler();

  useEffect(() => {
    (async () => {
      try {
        const r = await fetchRoles();
        if (r.length) setRoles(r);
      } catch (err) {
        handleAuthError(err);
      }
    })();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchUsers(filters);
      setRows(data);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filters.role, filters.status]);

  async function changeRole(id, newRole) {
    const prev = rows;
    setRows((r) => r.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    try {
      await updateUserRole(id, newRole);
    } catch (err) {
      setRows(prev);
      handleAuthError(err);
    }
  }

  async function toggleActive(id, next) {
    const prev = rows;
    setRows((r) => r.map((u) => (u.id === id ? { ...u, is_active: next } : u)));
    try {
      await updateUserActive(id, next);
    } catch (err) {
      setRows(prev);
      handleAuthError(err);
    }
  }

  function handleCreated(created) {
    setRows((prev) => [created, ...prev]);
  }

  const filtered = useMemo(() => rows, [rows]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Users</h1>

      <UsersFilters
        roles={roles}
        filters={filters}
        setFilters={setFilters}
        onRefresh={load}
        onOpenCreate={() => setCreatingOpen(true)}
      />

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th style={{ textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className={styles.muted}>
                  Loading…
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={3} className={styles.muted}>
                  No users
                </td>
              </tr>
            )}

            {filtered.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                roles={roles}
                onChangeRole={changeRole}
                onToggleActive={toggleActive}
              />
            ))}
          </tbody>
        </table>
      </div>

      <CreateUserModal
        open={creatingOpen}
        onClose={() => setCreatingOpen(false)}
        roles={roles}
        doCreate={createUser}
        onCreated={handleCreated}
        onError={(msg) => console.warn(msg)}
      />
    </div>
  );
}
