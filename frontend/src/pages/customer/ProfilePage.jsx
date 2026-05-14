function ProfilePage() {
  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Profile</p>
          <h1>Your V SHOP identity.</h1>
          <p>Manage personal details, saved addresses, reward tier, and shopping preferences.</p>
        </div>
        <button className="customer-primary-button" type="button">Edit Profile</button>
      </section>

      <section className="customer-content-grid">
        <article className="customer-panel">
          <div className="customer-profile-large">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80" alt="Anaya Rao" />
            <div>
              <p className="customer-eyebrow">Gold member</p>
              <h2>Anaya Rao</h2>
              <span>anaya.rao@example.com</span>
            </div>
          </div>
        </article>

        <article className="customer-panel">
          <div className="customer-panel__header"><div><p className="customer-eyebrow">Saved addresses</p><h2>Delivery locations</h2></div></div>
          <div className="address-card">
            <h3>Home</h3>
            <p>Indiranagar, Bengaluru, Karnataka 560038</p>
            <span>Default address</span>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ProfilePage;
