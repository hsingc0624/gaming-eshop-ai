import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const items = [
    { label: "Dashboard", path: "/" },
    { label: "Orders", path: "/orders" },
    { label: "Marketing", path: "/campaigns" },
    { label: "Users", path: "/users" },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Admin</div>
      <nav className={styles.nav}>
        {items.map((x) => (
          <NavLink
            key={x.path}
            to={x.path}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ""}`
            }
          >
            {x.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
