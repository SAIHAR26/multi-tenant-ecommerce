import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStores } from "../../services/storeService";

function VendorsPage() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getStores();
        setStores(Array.isArray(data) ? data : []);
      } catch {
        setError("Failed to load stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const activeStores = useMemo(
    () => stores.filter((store) => store.storeName),
    [stores]
  );

  const missingMediaCount = activeStores.filter(
    (store) => !store.storeBanner || !store.storeLogo
  ).length;

  const averageRating = activeStores.length
    ? (
        activeStores.reduce((total, store) => total + Number(store.averageRating || 4.5), 0) /
        activeStores.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Vendor management</p>
          <h1>Manage marketplace stores.</h1>
          <p>Review onboarding, monitor store health, and keep premium sellers ready for customers.</p>
        </div>
        <button className="hero-action" type="button" onClick={() => navigate("/admin/vendor-approvals")}>
          Approve Vendor
        </button>
      </section>

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple">
          <div className="dashboard-card__top"><span>Active Stores</span><strong>Live</strong></div>
          <h2>{activeStores.length}</h2>
          <p>Connected stores in MongoDB</p>
        </article>
        <article className="dashboard-card dashboard-card--blue">
          <div className="dashboard-card__top"><span>Missing Media</span><strong>Review</strong></div>
          <h2>{missingMediaCount}</h2>
          <p>Stores without logo or banner</p>
        </article>
        <article className="dashboard-card dashboard-card--cyan">
          <div className="dashboard-card__top"><span>Avg Store Score</span><strong>Stable</strong></div>
          <h2>{averageRating}/5</h2>
          <p>Quality and fulfillment score</p>
        </article>
        <article className="dashboard-card dashboard-card--violet">
          <div className="dashboard-card__top"><span>Categories</span><strong>Live</strong></div>
          <h2>{new Set(activeStores.map((store) => store.storeCategory)).size}</h2>
          <p>Store categories available</p>
        </article>
      </section>

      <section className="dashboard-bento">
        <article className="glass-panel orders-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Store directory</p>
              <h2>Connected marketplace stores</h2>
            </div>
            <input className="panel-search" type="search" placeholder="Search stores..." />
          </div>
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr><th>Store</th><th>Category</th><th>Status</th><th>Location</th><th>Rating</th></tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5">Loading stores...</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan="5">{error}</td>
                  </tr>
                )}
                {!loading && !error && activeStores.map((store) => (
                  <tr key={store._id}>
                    <td>{store.storeName}</td>
                    <td>{store.storeCategory}</td>
                    <td><span className="status-badge status-badge--live">Live</span></td>
                    <td>{store.location || "Marketplace"}</td>
                    <td>{store.averageRating || 4.5}/5</td>
                  </tr>
                ))}
                {!loading && !error && activeStores.length === 0 && (
                  <tr>
                    <td colSpan="5">No stores found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Approvals</p>
              <h2>Verification focus</h2>
            </div>
          </div>
          <div className="activity-list">
            <div className="activity-item"><span className="activity-dot" /><div><h3>KYC checks</h3><p>Vendor identities and bank details should match store ownership.</p><time>Priority</time></div></div>
            <div className="activity-item"><span className="activity-dot" /><div><h3>Catalog quality</h3><p>Store products now use name-matched images from MongoDB.</p><time>Today</time></div></div>
            <div className="activity-item"><span className="activity-dot" /><div><h3>Store media</h3><p>Banners and logos are saved on each store record.</p><time>Updated</time></div></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default VendorsPage;
