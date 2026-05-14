import { Link } from "react-router-dom";
import VendorStatsCard from "../../components/VendorStatsCard";
import ProductsTable from "../../components/ProductsTable";
import OrdersSection from "../../components/OrdersSection";

const stats = [
  { label: "Total Products", value: "248", trend: "+18 this month", icon: "PR" },
  { label: "Total Revenue", value: "Rs. 70.2L", trend: "+12.8% growth", icon: "RV" },
  { label: "Total Orders", value: "1,426", trend: "96 new orders", icon: "OR" },
  { label: "Pending Deliveries", value: "37", trend: "8 priority shipments", icon: "DL" },
];

function VendorDashboard() {
  return (
    <>
      {/* Hero summary for the main seller command center. */}
      <section className="vendor-hero">
        <div>
          <p className="vendor-kicker">V SHOP seller workspace</p>
          <h1>Command your store with premium clarity.</h1>
          <p>
            Track products, revenue, orders, and growth signals from one
            polished vendor cockpit.
          </p>
        </div>

        <div className="vendor-hero-panel">
          <span>Live Store Score</span>
          <strong>94%</strong>
          <small>Excellent marketplace health</small>
        </div>
      </section>

      {/* Reusable KPI cards keep the dashboard glanceable. */}
      <section className="vendor-stats-grid" aria-label="Vendor statistics">
        {stats.map((stat) => (
          <VendorStatsCard key={stat.label} {...stat} />
        ))}
      </section>

      {/* Catalog and fulfillment previews link the overview to operational pages. */}
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

          <Link to="/vendor/add-product">Add Product</Link>
          <Link to="/vendor/products">Manage Inventory</Link>
          <Link to="/vendor/orders">View Orders</Link>
        </div>
      </section>
    </>
  );
}

export default VendorDashboard;
