import { useEffect, useState } from "react";
import {
  getAdminSettings,
  updateAdminSettings,
} from "../../services/adminSettingsService";

const defaultSettings = {
  displayName: "V SHOP Admin",
  email: "admin@vshop.in",
  workspace: "Founder workspace",
  commissionRate: "12",
  reviewModeration: true,
  payoutCycle: "Weekly",
  requireTwoFactor: true,
  sessionTimeout: "30",
  auditLogging: true,
};

function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getAdminSettings()
      .then((data) => {
        if (!isMounted) return;

        setSettings({
          ...defaultSettings,
          ...data,
          commissionRate: String(data.commissionRate ?? defaultSettings.commissionRate),
          sessionTimeout: String(data.sessionTimeout ?? defaultSettings.sessionTimeout),
        });
        setError("");
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Settings could not be loaded.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateSetting = (field, value) => {
    setSettings((currentSettings) => ({ ...currentSettings, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage("");
    setError("");

    try {
      const savedSettings = await updateAdminSettings({
        ...settings,
        commissionRate: Number(settings.commissionRate || 0),
        sessionTimeout: Number(settings.sessionTimeout || 0),
      });

      setSettings({
        ...defaultSettings,
        ...savedSettings,
        commissionRate: String(savedSettings.commissionRate ?? defaultSettings.commissionRate),
        sessionTimeout: String(savedSettings.sessionTimeout ?? defaultSettings.sessionTimeout),
      });
      setStatusMessage("Settings saved to the admin backend.");
    } catch (saveError) {
      setError(saveError.message || "Settings could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Settings</p>
          <h1>Configure the V SHOP platform.</h1>
          <p>Manage admin profile, security controls, tenant rules, and marketplace preferences.</p>
        </div>
        <button className="hero-action" type="button" disabled={saving || loading} onClick={handleSave}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      {loading ? <div className="notification-state">Loading settings...</div> : null}
      {(statusMessage || error) ? (
        <p className={`admin-action-status ${error ? "admin-action-status--error" : "admin-action-status--success"}`}>
          {error || statusMessage}
        </p>
      ) : null}

      <section className="management-grid">
        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Admin profile</p><h2>Workspace identity</h2></div></div>
          <div className="settings-list">
            <label><span>Display name</span><input type="text" value={settings.displayName} onChange={(event) => updateSetting("displayName", event.target.value)} /></label>
            <label><span>Email</span><input type="email" value={settings.email} onChange={(event) => updateSetting("email", event.target.value)} /></label>
            <label><span>Workspace</span><input type="text" value={settings.workspace} onChange={(event) => updateSetting("workspace", event.target.value)} /></label>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Security</p><h2>Access controls</h2></div></div>
          <div className="settings-list">
            <label>
              <span>Two-factor authentication</span>
              <select value={settings.requireTwoFactor ? "enabled" : "disabled"} onChange={(event) => updateSetting("requireTwoFactor", event.target.value === "enabled")}>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>
            <label><span>Session timeout</span><input type="number" min="5" value={settings.sessionTimeout} onChange={(event) => updateSetting("sessionTimeout", event.target.value)} /></label>
            <label>
              <span>Audit logging</span>
              <select value={settings.auditLogging ? "active" : "paused"} onChange={(event) => updateSetting("auditLogging", event.target.value === "active")}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </label>
          </div>
        </article>
      </section>

      <section className="glass-panel">
        <div className="panel-header"><div><p className="admin-eyebrow">Platform settings</p><h2>Marketplace rules</h2></div></div>
        <div className="settings-list">
          <label><span>Commission rate</span><input type="number" min="0" max="100" value={settings.commissionRate} onChange={(event) => updateSetting("commissionRate", event.target.value)} /></label>
          <label>
            <span>Review moderation</span>
            <select value={settings.reviewModeration ? "enabled" : "disabled"} onChange={(event) => updateSetting("reviewModeration", event.target.value === "enabled")}>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </label>
          <label>
            <span>Payout cycle</span>
            <select value={settings.payoutCycle} onChange={(event) => updateSetting("payoutCycle", event.target.value)}>
              <option value="Weekly">Weekly</option>
              <option value="Biweekly">Biweekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
