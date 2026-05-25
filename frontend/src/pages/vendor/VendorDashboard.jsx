import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import VendorNavbar from "../../components/VendorNavbar";
import VendorSidebar from "../../components/VendorSidebar";
import VendorStatsCard from "../../components/VendorStatsCard";
import ProductsTable from "../../components/ProductsTable";
import OrdersSection from "../../components/OrdersSection";
import { getFallbackVendorStats, getVendorStats } from "../../services/vendorStatsService";
import "../VendorDashboard.css";

function VendorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchVendorStats() {
      try {
        const data = await getVendorStats();
        if (isMounted) {
          setStats(data);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setStats(getFallbackVendorStats());
          setError(err.message || "Unable to load vendor statistics.");
          setLoading(false);
        }
      }
    }

    fetchVendorStats();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="vendor-dashboard" style={{ padding: "40px", color: "#fff" }}>
        <LoadingState message="Loading seller workspace..." />
      </div>
    );
  }

  return (
    <div className="vendor-dashboard">
      <VendorSidebar />

      <div className="vendor-shell">
        <VendorNavbar />

        <main className="vendor-main">
          <section className="vendor-hero">
            <div>
              <p className="vendor-kicker">V SHOP seller workspace</p>
              <h1>Command your store with premium clarity.</h1>
              <p>
                Track products, revenue, orders, and growth signals from one
                polished vendor cockpit.
              </p>
              {error && (
                <small style={{ color: "orange", display: "block", marginTop: "8px" }}>
                  Offline stats shown: {error}
                </small>
              )}
            </div>

            <div className="vendor-hero-panel">
              <span>Live Store Score</span>
              <strong>94%</strong>
              <small>Excellent marketplace health</small>
            </div>
          </section>

          <section className="vendor-stats-grid" aria-label="Vendor statistics">
            {stats.length > 0 ? (
              stats.map((stat) => <VendorStatsCard key={stat.label} {...stat} />)
            ) : (
              <ErrorState title="No vendor stats" message="Vendor metrics are not available yet." />
            )}
          </section>

          <section className="vendor-content-grid">
            <ProductsTable />
            <OrdersSection />
          </section>

          <section className="vendor-insights-grid">
            <div className="vendor-panel revenue-panel">
              <div className="vendor-section-heading">
                <div>
                  <p>Revenue analytics</p>
                  <h2>Monthly revenue pulse</h2>
                </div>
                <span>+24.2%</span>
              </div>

              <div className="revenue-chart" aria-label="Revenue chart placeholder">
                <span style={{ height: "42%" }} />
                <span style={{ height: "58%" }} />
                <span style={{ height: "49%" }} />
                <span style={{ height: "74%" }} />
                <span style={{ height: "68%" }} />
                <span style={{ height: "84%" }} />
                <span style={{ height: "92%" }} />
              </div>
            </div>

            <div className="vendor-panel growth-panel">
              <div className="vendor-section-heading">
                <div>
                  <p>Orders growth</p>
                  <h2>Fulfillment momentum</h2>
                </div>
                <span>Strong</span>
              </div>

              <div className="growth-chart" aria-label="Orders growth chart placeholder">
                <div className="growth-line" />
                <div className="growth-dot growth-dot-one" />
                <div className="growth-dot growth-dot-two" />
                <div className="growth-dot growth-dot-three" />
              </div>
            </div>

            <div className="vendor-panel quick-actions">
              <div className="vendor-section-heading">
                <div>
                  <p>Quick actions</p>
                  <h2>Move faster</h2>
                </div>
              </div>

              <button type="button" onClick={() => navigate("/vendor/add-product")}>Add Product</button>
              <button type="button" onClick={() => navigate("/vendor/products")}>Manage Inventory</button>
              <button type="button" onClick={() => navigate("/vendor/orders")}>View Orders</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default VendorDashboard;
