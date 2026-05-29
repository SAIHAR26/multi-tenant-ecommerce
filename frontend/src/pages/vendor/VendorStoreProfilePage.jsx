import { useEffect, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getVendorProducts, getVendorStore } from "../../services/vendorService";

function VendorStoreProfilePage() {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([getVendorStore(), getVendorProducts()])
      .then(([storeData, productData]) => {
        if (!isMounted) return;
        setStore(storeData?.store || null);
        setProducts(Array.isArray(productData?.products) ? productData.products : []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Store profile could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="vendor-page-header vendor-store-profile-hero">
        <div>
          <p className="vendor-kicker">Store profile</p>
          <h1>{store?.storeName || "Store Profile"}</h1>
          <span>{store?.storeDescription || "Your live MongoDB storefront details."}</span>
        </div>
      </section>

      {loading ? <LoadingState message="Loading store profile..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load store" message={error} /> : null}

      {!loading && !error ? (
        <section className="vendor-insights-grid">
          <article className="vendor-panel">
            <div className="vendor-section-heading"><div><p>Store details</p><h2>{store?.storeCategory || "Marketplace"}</h2></div><span>{store?.location || "Online"}</span></div>
            <ul className="vendor-metric-list">
              <li><span>Store ID</span><strong>{store?._id?.slice(-8).toUpperCase()}</strong></li>
              <li><span>Products</span><strong>{products.length}</strong></li>
              <li><span>Average Rating</span><strong>{Number(store?.averageRating || 0).toFixed(1)}</strong></li>
            </ul>
          </article>

          <article className="vendor-panel">
            <div className="vendor-section-heading"><div><p>Catalog preview</p><h2>Live products</h2></div></div>
            {products.length ? (
              <ul className="vendor-metric-list">
                {products.slice(0, 5).map((product) => (
                  <li key={product._id}><span>{product.name}<small>{product.category}</small></span><strong>Rs {Number(product.price || 0).toLocaleString("en-IN")}</strong></li>
                ))}
              </ul>
            ) : (
              <ErrorState title="No products" message="Add products to populate the storefront." />
            )}
          </article>
        </section>
      ) : null}
    </>
  );
}

export default VendorStoreProfilePage;
