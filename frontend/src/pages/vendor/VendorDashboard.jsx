import { useEffect, useState } from "react";
import VendorNavbar from "../../components/VendorNavbar";
import VendorSidebar from "../../components/VendorSidebar";
import VendorStatsCard from "../../components/VendorStatsCard";
import ProductsTable from "../../components/ProductsTable";
import OrdersSection from "../../components/OrdersSection";
import "../VendorDashboard.css"; // Fixed path to match your layout's structure

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function VendorDashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchVendorStats() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/vendor/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard metrics.");
        }

        const data = await response.json();
        if (isMounted) {
          setStats(data.stats || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setStats([
            { label: "Total Products", value: "248", trend: "+18 this month", icon: "PR" },
            { label: "Total Revenue", value: "₹70.2L", trend: "+12.8% growth", icon: "RV" },
            { label: "Total Orders", value: "1,426", trend: "96 new orders", icon: "OR" },
            { label: "Pending Deliveries", value: "37", trend: "8 priority shipments", icon: "DL" }
          ]);
          setError("Using backup offline stats: " + (err.message || ""));
          setLoading(false);
        }
      }
    }

    fetchVendorStats();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="vendor-dashboard" style={{ padding: "40px", color: "#fff" }}>
        <p>Loading seller workspace controls...</p>
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
              {error && <small style={{ color: "orange", display: "block", marginTop: "8px" }}>{error}</small>}
            </div>

            <div className="vendor-hero-panel">
              <span>Live Store Score</span>
              <strong>94%</strong>
              <small>Excellent marketplace health</small>
            </div>
          </section>

          <section className="vendor-stats-grid" aria-label="Vendor statistics">
            {stats.map((stat) => (
              <VendorStatsCard key={stat.label} {...stat} />
            ))}
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

              <button type="button">Add Product</button>
              <button type="button">Manage Inventory</button>
              <button type="button">View Orders</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default VendorDashboard;