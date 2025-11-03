import { useState, useEffect } from "react";
import Modal from "../Modal";
import styles from "../../pages/Users.module.css";

export default function CreateUserModal({ open, onClose, roles, onCreated, onError, doCreate }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    is_active: true,
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (open) {
      setErr(null);
      setBusy(false);
      setForm({
        name: "",
        email: "",
        role: roles?.[0] || "",
        is_active: true,
        password: "",
      });
    }
  }, [open, roles]);

  async function submit(e) {
    e?.preventDefault?.();
    setBusy(true);
    setErr(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        is_active: !!form.is_active,
        ...(form.password ? { password: form.password } : {}),
      };
      const created = await doCreate(payload);
      onCreated?.(created);
      onClose?.();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to create user";
      setErr(msg);
      onError?.(msg);
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={busy ? undefined : onClose}>
      <form className={styles.modalContent} onSubmit={submit}>
        <h3 className={styles.modalTitle}>Create New User</h3>

        {err && <div className={styles.errorBox}>{err}</div>}

        <label className={styles.label}>
          <span>Name</span>
          <input
            className={styles.input}
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Full name"
          />
        </label>

        <label className={styles.label}>
          <span>Email</span>
          <input
            className={styles.input}
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="email@example.com"
          />
        </label>

        <label className={styles.label}>
          <span>Role</span>
          <select
            className={styles.input}
            required
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
          >
            {roles?.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={!!form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
          />
          <span>Active</span>
        </label>

        <label className={styles.label}>
          <span>Password (optional)</span>
          <input
            className={styles.input}
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Leave blank to auto-generate"
          />
        </label>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button type="submit" className={styles.btnPrimary} disabled={busy}>
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
