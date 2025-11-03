import styles from "../../pages/Users.module.css";

export default function UsersFilters({ roles, filters, setFilters, onRefresh, onOpenCreate }) {
  return (
    <div className={styles.filters}>
      <select
        className={styles.input}
        value={filters.role}
        onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
      >
        <option value="">All Roles</option>
        {roles.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <select
        className={styles.input}
        value={filters.status}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button className={styles.btnSecondary} onClick={onRefresh}>
        Refresh
      </button>

      <button className={styles.btnPrimary} onClick={onOpenCreate}>
        New User
      </button>
    </div>
  );
}
