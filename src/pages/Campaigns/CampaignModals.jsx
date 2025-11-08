import Modal from "../../components/Modal";
import styles from "./Campaigns.module.css";

export default function CampaignModals({
  modal,
  testEmail,
  schedAt,
  setTestEmail,
  setSchedAt,
  onClose,
  onSendTest,
  onSchedule,
}) {
  if (!modal.type) return null;

  if (modal.type === "test") {
    return (
      <Modal open onClose={onClose}>
        <form className={styles.modal} onSubmit={onSendTest}>
          <h3 className={styles.modalTitle}>Send Test</h3>
          <input
            className={styles.input}
            type="email"
            required
            placeholder="name@example.com"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
            >
              Cancel
            </button>
            <button className={styles.btnPrimary}>Send</button>
          </div>
        </form>
      </Modal>
    );
  }

  if (modal.type === "schedule") {
    return (
      <Modal open onClose={onClose}>
        <form className={styles.modal} onSubmit={onSchedule}>
          <h3 className={styles.modalTitle}>Schedule Campaign</h3>
          <input
            className={styles.input}
            type="datetime-local"
            required
            value={schedAt}
            onChange={(e) => setSchedAt(e.target.value)}
          />
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
            >
              Cancel
            </button>
            <button className={styles.btnPrimary}>Schedule</button>
          </div>
        </form>
      </Modal>
    );
  }

  return null;
}
    