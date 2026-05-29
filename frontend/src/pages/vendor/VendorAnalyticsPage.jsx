import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getVendorAnalytics } from "../../services/vendorService";

const formatPrice = (price = 0) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;

function VendorAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getVendorAnalytics()
      .then((data) => {
        if (isMounted) {
          setAnalytics(data?.analytics || {});
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Analytics could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const products = useMemo(() => analytics?.topProducts || [], [analytics]);
  const monthlyRevenue = analytics?.monthlyRevenue || [];
  const maxMonthly = Math.max(...monthlyRevenue.map((item) => item.total), 1);
  const rankedProducts = useMemo(() => products.slice(0, 4), [products]);

  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Performance lab</p>
          <h1>Analytics</h1>
          <span>Read sales patterns, product rankings, monthly performance, and customer signals.</span>
        </div>
      </section>

      {loading ? <LoadingState message="Loading analytics..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load analytics" message={error} /> : null}

      {!loading && !error ? (
        <section className="vendor-insights-grid">
          <div className="vendor-panel revenue-panel">
            <div className="vendor-section-heading"><div><p>Sales charts</p><h2>Monthly performance</h2></div><span>Live</span></div>
            <div className="revenue-chart">
              {monthlyRevenue.map((item) => (
                <span key={item.label} title={`${item.label}: ${formatPrice(item.total)}`} style={{ height: `${Math.max((item.total / maxMonthly) * 100, 8)}%` }} />
              ))}
            </div>
          </div>
          <div className="vendor-panel">
            <div className="vendor-section-heading"><div><p>Customer insights</p><h2>Audience quality</h2></div><span>MongoDB</span></div>
            <ul className="vendor-metric-list">
              <li><span>Catalog items</span><strong>{analytics?.totalProducts || 0}</strong></li>
              <li><span>Average rating</span><strong>{Number(analytics?.averageRating || 0).toFixed(1)}</strong></li>
              <li><span>Low stock</span><strong>{analytics?.lowStockProducts || 0}</strong></li>
            </ul>
          </div>
          <div className="vendor-panel">
            <div className="vendor-section-heading"><div><p>Product ranking</p><h2>Best and least sellers</h2></div></div>
            {rankedProducts.length > 0 ? (
              <ul className="vendor-metric-list">
                {rankedProducts.map((product) => (
                  <li key={product._id || product.id}>
                    <span>{product.name}<small>{product.category}</small></span>
                    <strong>{formatPrice(product.price)}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <ErrorState title="No products" message="No product analytics available yet." />
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}

export default VendorAnalyticsPage;
