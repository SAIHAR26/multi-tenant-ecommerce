import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteProduct, getProducts, updateProduct } from "../../services/productService";

const getEditForm = (product) => ({
  name: product.name || "",
  description: product.description || "",
  category: product.category || "",
  brand: product.brand || "",
  price: String(product.price || 0),
  stock: String(product.stock || 0),
  discount: String(product.discount || 0),
  status: product.status || (product.isActive === false ? "Hidden" : "Live"),
  sku: product.sku || "",
});

function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);

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

  const startEdit = (product) => {
    setEditingProduct(product);
    setEditForm(getEditForm(product));
    setStatusMessage("");
    setError("");
  };

  const updateEditField = (field, value) => {
    setEditForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingProduct || !editForm) return;

    setSaving(true);
    setStatusMessage("");
    setError("");

    try {
      const payload = {
        ...editingProduct,
        ...editForm,
        price: Number(editForm.price || 0),
        stock: Number(editForm.stock || 0),
        discount: Number(editForm.discount || 0),
        isActive: editForm.status === "Live",
        storeId: editingProduct.storeId?._id || editingProduct.storeId,
        vendor: editingProduct.vendor?._id || editingProduct.vendor,
      };
      const updatedProduct = await updateProduct(editingProduct._id, payload);

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === editingProduct._id
            ? { ...product, ...updatedProduct, storeId: product.storeId, vendor: product.vendor }
            : product
        )
      );
      setEditingProduct(null);
      setEditForm(null);
      setStatusMessage("Product updated successfully.");
    } catch (updateError) {
      setError(updateError.message || "Product could not be updated.");
    } finally {
      setSaving(false);
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
                        className="text-button"
                        type="button"
                        onClick={() => startEdit(product)}
                      >
                        Edit
                      </button>
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

      {editingProduct && editForm ? (
        <section className="glass-panel">
          <div className="panel-header">
            <div>
              <p className="admin-eyebrow">Edit product</p>
              <h2>{editingProduct.name}</h2>
            </div>
            <button className="text-button" type="button" onClick={() => setEditingProduct(null)}>
              Cancel
            </button>
          </div>

          <form className="segment-form product-center-form" onSubmit={handleUpdate}>
            <label><span>Product Name</span><input required value={editForm.name} onChange={(event) => updateEditField("name", event.target.value)} /></label>
            <label><span>Description</span><textarea required value={editForm.description} onChange={(event) => updateEditField("description", event.target.value)} /></label>
            <div className="product-form-row">
              <label><span>Category</span><input required value={editForm.category} onChange={(event) => updateEditField("category", event.target.value)} /></label>
              <label><span>Brand</span><input required value={editForm.brand} onChange={(event) => updateEditField("brand", event.target.value)} /></label>
              <label><span>SKU</span><input value={editForm.sku} onChange={(event) => updateEditField("sku", event.target.value)} /></label>
            </div>
            <div className="product-form-row">
              <label><span>Price</span><input required type="number" min="0" value={editForm.price} onChange={(event) => updateEditField("price", event.target.value)} /></label>
              <label><span>Stock</span><input type="number" min="0" value={editForm.stock} onChange={(event) => updateEditField("stock", event.target.value)} /></label>
              <label><span>Discount</span><input type="number" min="0" max="100" value={editForm.discount} onChange={(event) => updateEditField("discount", event.target.value)} /></label>
              <label>
                <span>Status</span>
                <select value={editForm.status} onChange={(event) => updateEditField("status", event.target.value)}>
                  <option value="Live">Live</option>
                  <option value="Draft">Draft</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </label>
            </div>
            <div className="segment-actions">
              <button className="hero-action" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}

export default ProductsPage;
