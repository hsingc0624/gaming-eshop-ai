import styles from "./Campaigns.module.css";

export default function CampaignTable({
  rows,
  loading,
  onOpenTest,
  onOpenSchedule,
}) {
  if (loading) return <div className={styles.muted}>Loading…</div>;

  if (!rows?.length) return <div className={styles.muted}>No campaigns</div>;

  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Audience</th>
            <th>Scheduled</th>
            <th>Status</th>
            <th>Sent</th>
            <th>Open rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td className={styles.dim}>{c.segment || "All subscribers"}</td>
              <td className={styles.dim}>
                {c.scheduled_at
                  ? new Date(c.scheduled_at).toLocaleString()
                  : "-"}
              </td>
              <td>
                <span
                  className={`${styles.badge} ${
                    styles["st_" + (c.status || "draft")]
                  }`}
                >
                  {c.status || "draft"}
                </span>
              </td>
              <td>{c.sent_count ?? 0}</td>
              <td className={styles.dim}>
                {c.open_rate ? `${c.open_rate}%` : "—"}
              </td>
              <td className={styles.actions}>
                <button
                  className={styles.btnGhost}
                  onClick={() => onOpenTest(c.id)}
                >
                  Send Test
                </button>
                <button
                  className={styles.btnGhost}
                  onClick={() => onOpenSchedule(c.id)}
                >
                  Schedule
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
