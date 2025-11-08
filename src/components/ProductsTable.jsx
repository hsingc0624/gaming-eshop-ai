import { useState } from "react";
import { api } from "../lib/api";
import styles from "./ProductsTable.module.css";

function currency(cents) {
  if (cents == null) return "-";
  return (Number(cents) / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

function sumStock(variants = []) {
  return variants.reduce((n, v) => n + (Number(v?.stock) || 0), 0);
}

export default function ProductsTable({ rows = [], onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(p) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      setDeletingId(p.id);
      await api.delete(`/api/products/${p.id}`);
      onDelete?.(p.id);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Stock</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const img = p.images?.[0]?.url;
            const price = p.sale_price_cents ?? p.price_cents;
            const stock = sumStock(p.variants);

            return (
              <tr key={p.id} className={styles.row}>
                <td className={styles.td}>
                  <div className={styles.productInfo}>
                    <div className={styles.thumbnail}>
                      {img && <img src={img} alt="" />}
                    </div>
                    <div>
                      <div className={styles.name}>{p.name}</div>
                      <div className={styles.slug}>{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.td}>{currency(price)}</td>
                <td className={styles.td}>{stock || 0}</td>
                <td className={styles.td}>
                  <span
                    className={`${styles.pill} ${
                      p.is_active ? styles.active : styles.inactive
                    }`}
                  >
                    {p.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className={`${styles.td} ${styles.actionsCell}`}>
                  <button
                    className={styles.btnDanger}
                    onClick={() => handleDelete(p)}
                    disabled={deletingId === p.id}
                    title="Delete product"
                    type="button"
                  >
                    {deletingId === p.id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td className={styles.noData} colSpan="5">
                No products
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
