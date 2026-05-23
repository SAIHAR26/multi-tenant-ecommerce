import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../services/productService";

function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (products.length === 0) {
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
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>

                    <td>
                      {product.vendor?.storeName || "V SHOP"}
                    </td>

                    <td>{product.stock || 0}</td>

                    <td>
                      <span className="status-badge status-badge--live">
                        Live
                      </span>
                    </td>

                    <td>₹{product.price}</td>
                  </tr>
                ))}
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
                    {product.vendor?.storeName || "V SHOP"}
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
