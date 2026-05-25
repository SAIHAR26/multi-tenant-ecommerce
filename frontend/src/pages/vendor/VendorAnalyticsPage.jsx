import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getSavedUser } from "../../api/auth";
import { getProducts } from "../../services/productService";

const formatPrice = (price = 0) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;

function VendorAnalyticsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const user = getSavedUser();

    getProducts(user?.role === "vendor" ? { vendor: user.id } : {})
      .then((data) => {
        const productsArray = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
        if (isMounted) {
          setProducts(productsArray);
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Analytics products could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const rankedProducts = useMemo(
    () =>
      [...products]
        .sort((first, second) => Number(second.rating || 0) - Number(first.rating || 0))
        .slice(0, 4),
    [products]
  );

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
            <div className="revenue-chart"><span style={{ height: "38%" }} /><span style={{ height: "63%" }} /><span style={{ height: "56%" }} /><span style={{ height: "82%" }} /><span style={{ height: "74%" }} /><span style={{ height: "95%" }} /></div>
          </div>
          <div className="vendor-panel">
            <div className="vendor-section-heading"><div><p>Customer insights</p><h2>Audience quality</h2></div><span>MongoDB</span></div>
            <ul className="vendor-metric-list">
              <li><span>Catalog items</span><strong>{products.length}</strong></li>
              <li><span>Average rating</span><strong>{getAverageRating(products)}</strong></li>
              <li><span>Low stock</span><strong>{products.filter((product) => Number(product.stock || 0) <= 10).length}</strong></li>
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

function getAverageRating(products) {
  if (!products.length) return "0.0";
  const total = products.reduce((sum, product) => sum + Number(product.rating || 0), 0);
  return (total / products.length).toFixed(1);
}

export default VendorAnalyticsPage;
