import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { getSavedUser } from "../../api/auth";
import { getProducts } from "../../services/productService";

const formatPrice = (price = 0) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;
const getStatus = (product) => {
  if (!product.isActive || Number(product.stock || 0) <= 0) return "Paused";
  if (Number(product.stock || 0) <= 10) return "Low Stock";
  return "Live";
};

function VendorProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
        if (isMounted) setError(err.message || "Products could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) =>
      [product.name, product.category, product.brand, product._id]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [products, searchTerm]);

  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Catalog command</p>
          <h1>Products</h1>
          <span>Search, monitor stock, and control live marketplace listings.</span>
        </div>
        <label className="vendor-filter-search">
          <span>Search products</span>
          <input
            type="search"
            placeholder="Search by product, SKU, category"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
      </section>

      {loading ? <LoadingState message="Loading products..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load products" message={error} /> : null}
      {!loading && !error && filteredProducts.length === 0 ? <ErrorState title="No products" message="No products matched this view." /> : null}

      {!loading && !error && filteredProducts.length > 0 ? (
        <>
          <section className="vendor-products-cards">
            {filteredProducts.slice(0, 4).map((product) => {
              const status = getStatus(product);

              return (
                <article className="vendor-product-card" key={product._id || product.id}>
                  <div className="product-image">{product.name?.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <h2>{product.name}</h2>
                    <p>{product.category} - {product._id?.slice(-6).toUpperCase()}</p>
                    <strong>{formatPrice(product.price)}</strong>
                  </div>
                  <span className={`product-status ${status.toLowerCase().replace(" ", "-")}`}>
                    {status}
                  </span>
                </article>
              );
            })}
          </section>

          <section className="products-table-panel">
            <div className="vendor-section-heading">
              <div>
                <p>Inventory table</p>
                <h2>Stock control</h2>
              </div>
              <button type="button">Export</button>
            </div>

            <div className="vendor-table-wrap">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStatus(product);

                    return (
                      <tr key={product._id || product.id}>
                        <td>{product.name}</td>
                        <td>{product._id?.slice(-6).toUpperCase()}</td>
                        <td>{product.category}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={`product-status ${status.toLowerCase().replace(" ", "-")}`}>
                            {status}
                          </span>
                        </td>
                        <td className="vendor-table-actions">
                          <button type="button" className="table-action">Edit</button>
                          <button type="button" className="table-action">Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : null}
    </>
  );
}

export default VendorProductsPage;
