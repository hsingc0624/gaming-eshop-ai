import styles from "../../pages/Users/Users.module.css";

export default function UserRow({ user, roles, onChangeRole, onToggleActive }) {
  return (
    <tr>
      <td>
        <div className={styles.userCell}>
          <div className={styles.avatar}>{(user.name || "?").slice(0, 1)}</div>
          <div>
            <div className={styles.name}>{user.name}</div>
            <div className={styles.email}>{user.email}</div>
          </div>
        </div>
      </td>
      <td>
        <select
          className={styles.input}
          value={user.role || ""}
          onChange={(e) => onChangeRole(user.id, e.target.value)}
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </td>
      <td style={{ textAlign: "center" }}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={!!user.is_active}
            onChange={(e) => onToggleActive(user.id, e.target.checked)}
          />
          <span className={styles.slider}></span>
        </label>
      </td>
    </tr>
  );
}
