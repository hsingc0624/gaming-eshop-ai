import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import LoginBar from "./components/LoginBar";
import Dashboard from "./pages/Dashboard";
import styles from "./App.module.css";
import AddProduct from "./pages/AddProduct";
import Users from "./pages/Users";
import OrderShow from "./pages/OrderShow";
import OrdersList from "./pages/OrdersList";

export default function App() {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) return <p className={styles.loading}>Loading...</p>;

  if (!user) {
    if (location.pathname === "/login") {
      return (
        <div className={styles.loginPage}>
          <h1 className={styles.loginTitle}>🎮 Gaming Admin Login</h1>
          <LoginBar />
        </div>
      );
    }
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.layout}>
      <Sidebar current="Dashboard" />
      <main className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.logo}>Gaming Admin</div>
          <LoginBar />
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:number" element={<OrderShow />} />
        </Routes>
      </main>
    </div>
  );
}
