import { useEffect, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getVendorRevenue } from "../../services/vendorService";

const formatPrice = (price = 0) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;

function VendorRevenuePage() {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getVendorRevenue()
      .then((data) => {
        if (isMounted) setRevenue(data?.revenue || {});
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Revenue could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const monthly = revenue?.monthly || [];
  const maxMonthly = Math.max(...monthly.map((item) => item.total), 1);

  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Revenue intelligence</p>
          <h1>Revenue</h1>
          <span>Understand payouts, monthly income, sales lift, and growth quality.</span>
        </div>
      </section>

      {loading ? <LoadingState message="Loading revenue..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load revenue" message={error} /> : null}

      {!loading && !error ? (
        <>
          <section className="vendor-stats-grid" aria-label="Revenue statistics">
            <article className="vendor-stat-card"><div className="vendor-stat-icon">GM</div><div><p>Gross Sales</p><strong>{formatPrice(revenue?.grossSales)}</strong><span>Live orders</span></div></article>
            <article className="vendor-stat-card"><div className="vendor-stat-icon">PT</div><div><p>Payout Ready</p><strong>{formatPrice(revenue?.payoutReady)}</strong><span>Estimated net</span></div></article>
            <article className="vendor-stat-card"><div className="vendor-stat-icon">AV</div><div><p>Avg Order</p><strong>{formatPrice(revenue?.averageOrder)}</strong><span>Vendor items only</span></div></article>
            <article className="vendor-stat-card"><div className="vendor-stat-icon">GR</div><div><p>Growth</p><strong>{Number(revenue?.growthPercentage || 0).toFixed(1)}%</strong><span>Month over month</span></div></article>
          </section>

          <section className="vendor-insights-grid">
            <div className="vendor-panel revenue-panel">
              <div className="vendor-section-heading"><div><p>Monthly income</p><h2>Income chart</h2></div><span>MongoDB</span></div>
              <div className="revenue-chart">
                {monthly.map((item) => (
                  <span key={item.label} title={`${item.label}: ${formatPrice(item.total)}`} style={{ height: `${Math.max((item.total / maxMonthly) * 100, 8)}%` }} />
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}

export default VendorRevenuePage;
