import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createCampaign, scheduleCampaign, sendTestCampaign } from "../../lib/campaignsApi";
import styles from "./CampaignCreate.module.css";

export default function CampaignCreate() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [segment, setSegment] = useState("newsletter");
  const [heading, setHeading] = useState("Save 20% on Select Games");
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/640x360?text=Product");
  const [body, setBody] = useState("For a limited time, enjoy 20% off on select video games. Use promo code SPRING20 at checkout.");
  const [testEmail, setTestEmail] = useState("");
  const [scheduleLater, setScheduleLater] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const html = useMemo(() => buildEmailHtml({ heading, imageUrl, body }), [heading, imageUrl, body]);

  async function onSaveDraft() {
    await createCampaign({ name, subject, segment, html, status: "draft" });
    nav("/campaigns");
  }

  async function onSendNow() {
    const _c = await createCampaign({ name, subject, segment, html, status: "scheduled" });
    await scheduleCampaign(_c.id, new Date().toISOString());
    nav("/campaigns");
  }

  async function onSchedule() {
    const _c = await createCampaign({ name, subject, segment, html, status: "scheduled" });
    await scheduleCampaign(_c.id, new Date(scheduledAt).toISOString());
    nav("/campaigns");
  }

  async function onSendTest() {
    const _c = await createCampaign({ name: name || "(Test Draft)", subject, segment, html, status: "draft" });
    await sendTestCampaign(_c.id, testEmail);
    alert("Test sent");
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Create Campaign</h1>

      <div className={styles.formRow}>
        <label className={styles.label}>Name</label>
        <input className={styles.input} value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>Subject</label>
        <input className={styles.input} value={subject} onChange={e => setSubject(e.target.value)} />
      </div>

      <div className={styles.formRow}>
        <label className={styles.label}>Recipient List</label>
        <select className={styles.input} value={segment} onChange={e => setSegment(e.target.value)}>
          <option value="newsletter">Newsletter Subscribers</option>
          <option value="">All Subscribers</option>
        </select>
      </div>

      <div className={styles.editorGrid}>
        <div className={styles.preview}>
          <EmailPreview heading={heading} imageUrl={imageUrl} body={body} />
        </div>
        <div className={styles.editor}>
          <label className={styles.label}>Heading</label>
          <input className={styles.input} value={heading} onChange={e => setHeading(e.target.value)} />

          <label className={styles.label}>Image</label>
          <input className={styles.input} value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://" />

          <label className={styles.label}>Body</label>
          <textarea className={styles.textarea} value={body} onChange={e => setBody(e.target.value)} />
        </div>
      </div>

      <div className={styles.scheduleCard}>
        <div className={styles.scheduleRow}>
          <label>
            <input type="radio" checked={!scheduleLater} onChange={() => setScheduleLater(false)} />
            <span> Send immediately</span>
          </label>
          <label>
            <input type="radio" checked={scheduleLater} onChange={() => setScheduleLater(true)} />
            <span> Schedule for later</span>
          </label>
          {scheduleLater && (
            <input className={styles.input} type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
          )}
        </div>

        <div className={styles.scheduleRow}>
          <div>
            <div className={styles.dim}>Send Test</div>
            <input className={styles.input} type="email" placeholder="name@example.com" value={testEmail} onChange={e => setTestEmail(e.target.value)} />
          </div>
          <button className={styles.btnGhost} onClick={onSendTest}>Send Test</button>
        </div>

        <div className={styles.actionsRight}>
          <button className={styles.btnSecondary} onClick={onSaveDraft}>Save Draft</button>
          {!scheduleLater ? (
            <button className={styles.btnPrimary} onClick={onSendNow}>Send Now</button>
          ) : (
            <button className={styles.btnPrimary} onClick={onSchedule} disabled={!scheduledAt}>Schedule</button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmailPreview({ heading, imageUrl, body }) {
  return (
    <div className={styles.emailCard}>
      <h2 className={styles.emailH2}>{heading}</h2>
      <img src={imageUrl} alt="" className={styles.emailImg} />
      <p className={styles.emailP}>{body}</p>
      <button className={styles.emailCta}>SHOP NOW</button>
    </div>
  );
}

function buildEmailHtml({ heading, imageUrl, body }) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f6f6;padding:24px 0;font-family:Arial,sans-serif">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:24px">
          <tr><td style="font-size:28px;font-weight:700">${escapeHtml(heading)}</td></tr>
          <tr><td style="padding:12px 0"><img src="${imageUrl}" alt="" width="552" style="border-radius:12px;display:block;width:100%;height:auto"/></td></tr>
          <tr><td style="font-size:16px;line-height:1.6;color:#111">${escapeHtml(body)}</td></tr>
          <tr><td style="padding-top:16px">
            <a href="#" style="background:#111;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;display:inline-block">SHOP NOW</a>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[m]));
}
