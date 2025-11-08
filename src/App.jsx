import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import LoginBar from "./components/LoginBar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import OrderShow from "./pages/Orders/OrderShow";
import OrdersList from "./pages/Orders/OrdersList";
import Campaigns from "./pages/Campaigns/index";
import CampaignCreate from "./pages/Campaigns/CampaignCreate";
import styles from "./App.module.css";

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
          <ToastContainer position="top-center" autoClose={2500} />
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
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:number" element={<OrderShow />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/new" element={<CampaignCreate />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <ToastContainer position="top-center" autoClose={2500} theme="light" />
    </div>
  );
}
