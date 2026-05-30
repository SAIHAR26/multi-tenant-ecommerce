import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteProduct, getProducts } from "../../services/productService";

function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        setProducts(
          Array.isArray(data.products)
            ? data.products
            : Array.isArray(data)
            ? data
            : []
        );
      } catch (requestError) {
        setError(requestError.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      [
        product.name,
        product.category,
        product.brand,
        product.storeId?.storeName,
        product.vendor?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [products, searchTerm]);

  const handleDelete = async (productId) => {
    setStatusMessage("");
    setError("");

    try {
      await deleteProduct(productId);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== productId)
      );
      setStatusMessage("Product deleted successfully.");
    } catch (deleteError) {
      setError(deleteError.message || "Product could not be deleted.");
    }
  };

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (products.length === 0 && !error) {
    return <h2>No products found</h2>;
  }

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Product management</p>
          <h1>Control marketplace catalog quality.</h1>
          <p>
            Manage inventory, review listings, and track
            high-performing product drops.
          </p>
        </div>

        <button className="hero-action" type="button" onClick={() => navigate("/admin/add-product")}>
          Add Product
        </button>
      </section>

      {(statusMessage || error) && (
        <p className={`admin-action-status ${error ? "admin-action-status--error" : "admin-action-status--success"}`}>
          {error || statusMessage}
        </p>
      )}

      <section className="management-grid">
        <article className="glass-panel orders-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Catalog</p>
              <h2>Product management preview</h2>
            </div>

            <input
              className="panel-search"
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Vendor</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>

                    <td>
                      {product.storeId?.storeName || product.brand || "V SHOP"}
                    </td>

                    <td>{product.stock || 0}</td>

                    <td>
                      <span className="status-badge status-badge--live">
                        {product.isActive === false ? "Hidden" : "Live"}
                      </span>
                    </td>

                    <td>Rs {Number(product.price || 0).toLocaleString("en-IN")}</td>

                    <td>
                      <button
                        className="vendor-danger-button"
                        type="button"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6">No products matched your search</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Inventory</p>
              <h2>Stock alerts</h2>
            </div>
          </div>

          <div className="product-list">
            {products.slice(0, 3).map((product) => (
              <div className="product-row" key={product._id}>
                <div className="product-thumb">
                  {product.name?.slice(0, 2)}
                </div>

                <div>
                  <h3>{product.name}</h3>

                  <p>
                    {product.storeId?.storeName || product.brand || "V SHOP"}
                  </p>
                </div>

                <div className="product-meta">
                  <strong>{product.stock || 0}</strong>
                  <span>units</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

    </div>
  );
}

export default ProductsPage;
