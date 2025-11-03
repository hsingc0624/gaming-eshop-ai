import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { fm } from "../lib/money";
import styles from "./OrdersList.module.css";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/api/orders");
    setOrders(data?.data ?? data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className={styles.page}>Loading…</div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.muted}>No orders found</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.number}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td>{o.status}</td>
                <td>{fm(o.total_cents)}</td>
                <td>
                  <Link to={`/orders/${o.number}`} className={styles.linkBtn}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
