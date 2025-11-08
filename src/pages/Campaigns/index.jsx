import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listCampaigns,
  getCampaignMetrics,
  scheduleCampaign,
  sendTestCampaign,
} from "../../lib/campaignsApi";
import styles from "./Campaigns.module.css";
import CampaignChart from "./CampaignChart";
import CampaignTable from "./CampaignTable";
import CampaignModals from "./CampaignModals";
import { useAuthErrorHandler } from "../../hooks/useAuthErrorHandler";

export default function Campaigns() {
  const [spark, setSpark] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({ type: null, id: null });
  const [testEmail, setTestEmail] = useState("");
  const [schedAt, setSchedAt] = useState("");

  const handleAuthError = useAuthErrorHandler();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [list, metrics] = await Promise.all([
          listCampaigns(1),
          getCampaignMetrics(30).catch(() => []),
        ]);
        setRows(list?.data ?? list ?? []);
        setSpark(metrics);
      } catch (err) {
        handleAuthError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSendTest(e) {
    e.preventDefault();
    await sendTestCampaign(modal.id, testEmail);
    setModal({ type: null, id: null });
    alert("Test email sent");
  }

  async function handleSchedule(e) {
    e.preventDefault();
    const iso = new Date(schedAt).toISOString();
    const updated = await scheduleCampaign(modal.id, iso);
    setRows((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
    setModal({ type: null, id: null });
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>MARKETING</h1>
        <Link to="/campaigns/new" className={styles.btnPrimary}>
          New Campaign
        </Link>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>Campaign Performance</div>
        <CampaignChart
          data={spark.length ? spark.map((r) => r.sent) : undefined}
        />
      </div>

      <div className={styles.toolbar}>
        <button className={styles.btnGhost}>Filters ▾</button>
        <div className={styles.toolbarRight}>Create Campaign</div>
      </div>

      <CampaignTable
        rows={rows}
        loading={loading}
        onOpenTest={(id) => setModal({ type: "test", id })}
        onOpenSchedule={(id) => {
          setSchedAt(
            new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 16)
          );
          setModal({ type: "schedule", id });
        }}
      />

      <CampaignModals
        modal={modal}
        testEmail={testEmail}
        schedAt={schedAt}
        setTestEmail={setTestEmail}
        setSchedAt={setSchedAt}
        onClose={() => setModal({ type: null, id: null })}
        onSendTest={handleSendTest}
        onSchedule={handleSchedule}
      />
    </div>
  );
}
