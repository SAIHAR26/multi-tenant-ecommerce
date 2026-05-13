function SettingsPage() {
  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Settings</p>
          <h1>Configure the V SHOP platform.</h1>
          <p>Manage admin profile, security controls, tenant rules, and marketplace preferences.</p>
        </div>
        <button className="hero-action" type="button">Save Changes</button>
      </section>

      <section className="management-grid">
        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Admin profile</p><h2>Workspace identity</h2></div></div>
          <div className="settings-list">
            <label><span>Display name</span><input type="text" defaultValue="V SHOP Admin" /></label>
            <label><span>Email</span><input type="email" defaultValue="admin@vshop.in" /></label>
            <label><span>Workspace</span><input type="text" defaultValue="Founder workspace" /></label>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Security</p><h2>Access controls</h2></div></div>
          <div className="activity-list">
            <div className="activity-item"><span className="activity-dot" /><div><h3>Two-factor authentication</h3><p>Require 2FA for admin and vendor accounts.</p><time>Enabled</time></div></div>
            <div className="activity-item"><span className="activity-dot" /><div><h3>Session timeout</h3><p>Automatically expire inactive sessions.</p><time>30 minutes</time></div></div>
            <div className="activity-item"><span className="activity-dot" /><div><h3>Audit logging</h3><p>Track critical marketplace actions.</p><time>Active</time></div></div>
          </div>
        </article>
      </section>

      <section className="glass-panel">
        <div className="panel-header"><div><p className="admin-eyebrow">Platform settings</p><h2>Marketplace rules</h2></div></div>
        <div className="settings-grid">
          <div className="settings-card"><h3>Commission rate</h3><p>12% default vendor commission.</p></div>
          <div className="settings-card"><h3>Review moderation</h3><p>Auto-flag suspicious reviews.</p></div>
          <div className="settings-card"><h3>Payout cycle</h3><p>Weekly vendor settlements.</p></div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
