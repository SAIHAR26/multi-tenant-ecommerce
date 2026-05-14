function SettingsPage() {
  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Settings</p>
          <h1>Personalize your shopping experience.</h1>
          <p>Control notifications, privacy, payment preferences, and saved shopping defaults.</p>
        </div>
        <button className="customer-primary-button" type="button">Save Settings</button>
      </section>

      <section className="customer-content-grid">
        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Preferences</p><h2>Shopping settings</h2></div></div>
          <div className="settings-stack">
            <label><span>Favorite category</span><input type="text" defaultValue="Luxury accessories" /></label>
            <label><span>Preferred size</span><input type="text" defaultValue="Medium" /></label>
            <label><span>Default payment</span><input type="text" defaultValue="UPI" /></label>
          </div>
        </article>

        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Notifications</p><h2>Alert controls</h2></div></div>
          <div className="offer-stack">
            <div><strong>Order updates</strong><span>Enabled for shipment milestones.</span></div>
            <div><strong>Wishlist drops</strong><span>Enabled for price changes.</span></div>
            <div><strong>Reward alerts</strong><span>Enabled for points and offers.</span></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default SettingsPage;
