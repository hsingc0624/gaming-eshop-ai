import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./OrderShow.module.css";
import { fetchOrder, updateOrder, refundOrder } from "../lib/ordersApi";
import { fm } from "../lib/money";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "refunded", label: "Refunded" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderShow() {
  const { number } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const o = await fetchOrder(number);
      setOrder(o);
      setStatus(o.status);
      setNote(o.admin_note ?? "");
      setLoading(false);
    })();
  }, [number]);

  const shippingAddress = useMemo(() => {
    if (!order?.addresses) return null;
    return (
      order.addresses.find((a) => a.type === "shipping") || order.addresses[0]
    );
  }, [order]);

  const subtotal = order?.subtotal_cents ?? 0;
  const shipping = order?.shipping_cents ?? 0;
  const discount = order?.discount_cents ?? 0;
  const tax = order?.tax_cents ?? 0;
  const total = order?.total_cents ?? 0;

  async function onSave() {
    setSaving(true);
    try {
      const updated = await updateOrder(number, { status, admin_note: note });
      setOrder(updated);
    } catch (e) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function onRefund() {
    if (!window.confirm("Confirm refund this order?")) return;
    try {
      const { order: updated } = await refundOrder(number);
      setOrder(updated);
      setStatus(updated.status);
    } catch {
      alert("Refund failed");
    }
  }

  // ✅ 返回上一頁（有歷史就後退，冇就回 orders 列表）
  function safeBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/orders");
  }

  if (loading) return <div className={styles.page}>Loading…</div>;
  if (!order) return <div className={styles.page}>Order not found</div>;

  return (
    <div className={styles.page}>
      {/* 上方麵包屑 + 返回鍵 */}
      <div className={styles.topline}>
        <button type="button" onClick={safeBack} className={styles.backBtn}>
          ← Back
        </button>
        <div className={styles.breadcrumb}>
          <Link to="/orders" className={styles.breadcrumbLink}>
            Orders
          </Link>{" "}
          / {order.number}
        </div>
      </div>

      <div className={styles.headerRow}>
        <h1 className={styles.title}>Order #{order.number}</h1>
        <div className={styles.headerActions}>
          <button
            className={styles.btnDanger}
            onClick={onRefund}
            disabled={order.status === "refunded"}
          >
            Refund Order
          </button>
        </div>
      </div>

      <div className={styles.metaRow}>
        <div>
          Order Date:{" "}
          <strong>{new Date(order.created_at).toLocaleDateString()}</strong>
        </div>
        <div className={styles.statusWrap}>
          <span>Order Status</span>
          <select
            className={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>Order Summary</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th className={styles.right}>Price</th>
              <th className={styles.right}>Qty</th>
              <th className={styles.right}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.productCell}>
                    {item?.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.name}
                        className={styles.thumb}
                      />
                    )}
                    <div>
                      <div className={styles.prodName}>{item.name}</div>
                      {item.sku && (
                        <span className={styles.sku}>{item.sku}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className={styles.right}>{fm(item.price_cents)}</td>
                <td className={styles.right}>{item.qty}</td>
                <td className={styles.right}>{fm(item.subtotal_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.totalsGrid}>
          <div>
            <h4 className={styles.subTitle}>Shipping Address</h4>
            {shippingAddress ? (
              <div className={styles.addrBlock}>
                <div>{shippingAddress.name}</div>
                <div>{shippingAddress.line1}</div>
                {shippingAddress.line2 && <div>{shippingAddress.line2}</div>}
                <div>
                  {shippingAddress.city}, {shippingAddress.postcode}
                </div>
                <div>{shippingAddress.country}</div>
              </div>
            ) : (
              <div className={styles.muted}>No address</div>
            )}
          </div>

          <div className={styles.summaryBox}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <strong>{fm(subtotal)}</strong>
            </div>
            <div className={styles.row}>
              <span>Shipping</span>
              <strong>{shipping === 0 ? "Free" : fm(shipping)}</strong>
            </div>
            {discount > 0 && (
              <div className={styles.row}>
                <span>Discount</span>
                <strong>-{fm(discount)}</strong>
              </div>
            )}
            <div className={styles.row}>
              <span>VAT</span>
              <strong>{fm(tax)}</strong>
            </div>
            <div className={styles.rowTotal}>
              <span>Total</span>
              <strong>{fm(total)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <h3 className={styles.sectionTitle}>Order Total</h3>
        <textarea
          className={styles.note}
          placeholder="Add a note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className={styles.footerActions}>
          <button
            className={styles.btnPrimary}
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </section>
    </div>
  );
}
