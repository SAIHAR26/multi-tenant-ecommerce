import { getSavedUser } from "../../api/auth";

function ProfilePage() {
  const user = getSavedUser();
  const customerName = user?.name || "Customer";
  const customerEmail = user?.email || "customer@example.com";
  const initials = customerName
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
            <span className="customer-profile-large__avatar">{initials}</span>
            <div>
              <p className="customer-eyebrow">Gold member</p>
              <h2>{customerName}</h2>
              <span>{customerEmail}</span>
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
