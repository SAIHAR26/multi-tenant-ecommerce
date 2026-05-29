import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import { getVendorProducts } from "../services/vendorService";

const formatPrice = (price = 0) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;

const getStatus = (product) => {
  if (!product.isActive) return "Paused";
  if (Number(product.stock || 0) <= 0) return "Paused";
  if (Number(product.stock || 0) <= 10) return "Low Stock";
  return "Live";
};

function ProductsTable() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getVendorProducts()
      .then((data) => {
        const productsArray = Array.isArray(data?.products) ? data.products : [];
        if (isMounted) {
          setProducts(productsArray.slice(0, 5));
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Products could not be loaded.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="products-table-panel">
      <div className="vendor-section-heading">
        <div>
          <p>Product management</p>
          <h2>Active catalog</h2>
        </div>
        <button type="button" onClick={() => navigate("/vendor/products")}>View all</button>
      </div>

      {loading ? <LoadingState message="Loading products..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load products" message={error} /> : null}
      {!loading && !error && products.length === 0 ? <ErrorState title="No products" message="No catalog items found." /> : null}

      {!loading && !error && products.length > 0 ? (
        <div className="vendor-table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = getStatus(product);

                return (
                  <tr key={product._id || product.id}>
                    <td>
                      <div className="product-image">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          product.name?.slice(0, 2).toUpperCase()
                        )}
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={`product-status ${status.toLowerCase().replace(" ", "-")}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="table-action" onClick={() => navigate("/vendor/products")}>Open</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export default ProductsTable;
