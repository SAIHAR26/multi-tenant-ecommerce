import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import {
  deleteVendorProduct,
  getVendorProducts,
  updateVendorProduct,
} from "../../services/vendorService";
import { fileToOptimizedDataUrl } from "../../utils/imageUpload";

const formatPrice = (price = 0) => `Rs ${Number(price || 0).toLocaleString("en-IN")}`;

const getStatus = (product) => {
  if (!product.isActive || Number(product.stock || 0) <= 0) return "Paused";
  if (Number(product.stock || 0) <= 10) return "Low Stock";
  return "Live";
};

const listToText = (value) => (Array.isArray(value) ? value.join(", ") : value || "");

const getProductId = (product) => product?._id || product?.id;

const buildEditForm = (product) => ({
  name: product.name || "",
  description: product.description || "",
  price: product.price ?? "",
  discount: product.discount ?? "",
  category: product.category || "",
  brand: product.brand || "",
  stock: product.stock ?? "",
  sku: product.sku || "",
  status: product.status || (product.isActive ? "Live" : "Hidden"),
  sizes: listToText(product.sizes),
  colors: listToText(product.colors),
  tags: listToText(product.tags),
  images: Array.isArray(product.images) ? product.images : [],
});

function VendorProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getVendorProducts()
      .then((data) => {
        const productsArray = Array.isArray(data?.products) ? data.products : [];
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

  const startEdit = (product) => {
    setEditingProduct(product);
    setEditForm(buildEditForm(product));
    setActionMessage("");
    setError("");
  };

  const updateEditField = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handleEditImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const uploadedImages = await Promise.all(files.map((file) => fileToOptimizedDataUrl(file)));
      setEditForm((current) => ({
        ...current,
        images: [...current.images, ...uploadedImages],
      }));
    } catch {
      setError("Product images could not be loaded. Please try another file.");
    } finally {
      event.target.value = "";
    }
  };

  const removeEditImage = (imageToRemove) => {
    setEditForm((current) => ({
      ...current,
      images: current.images.filter((image) => image !== imageToRemove),
    }));
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    const productId = getProductId(editingProduct);
    if (!productId) return;

    setSaving(true);
    setActionMessage("");
    setError("");

    try {
      const payload = {
        ...editForm,
        price: Number(editForm.price || 0),
        discount: Number(editForm.discount || 0),
        stock: Number(editForm.stock || 0),
        sizes: editForm.sizes.split(",").map((item) => item.trim()).filter(Boolean),
        colors: editForm.colors.split(",").map((item) => item.trim()).filter(Boolean),
        tags: editForm.tags.split(",").map((item) => item.trim()).filter(Boolean),
      };
      const data = await updateVendorProduct(productId, payload);
      const updatedProduct = data?.product || { ...editingProduct, ...payload };

      setProducts((current) =>
        current.map((product) =>
          getProductId(product) === productId ? updatedProduct : product
        )
      );
      setEditingProduct(null);
      setEditForm(null);
      setActionMessage("Product updated.");
    } catch (err) {
      setError(err.message || "Product could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const productId = getProductId(product);
    if (!productId) return;
    const shouldDelete = window.confirm(`Delete ${product.name}? This cannot be undone.`);
    if (!shouldDelete) return;

    setSaving(true);
    setActionMessage("");
    setError("");

    try {
      await deleteVendorProduct(productId);
      setProducts((current) => current.filter((item) => getProductId(item) !== productId));
      setActionMessage("Product deleted.");
    } catch (err) {
      setError(err.message || "Product could not be deleted.");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products;

    return products.filter((product) =>
      [product.name, product.category, product.brand, product.sku, product._id]
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
      {!loading && actionMessage ? <p className="vendor-form-success">{actionMessage}</p> : null}
      {!loading && error ? <ErrorState title="Unable to load products" message={error} /> : null}
      {!loading && !error && filteredProducts.length === 0 ? <ErrorState title="No products" message="No products matched this view." /> : null}

      {!loading && !error && filteredProducts.length > 0 ? (
        <>
          <section className="vendor-products-cards">
            {filteredProducts.slice(0, 4).map((product) => {
              const status = getStatus(product);

              return (
                <article className="vendor-product-card" key={product._id || product.id}>
                  <div className="product-image">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} />
                    ) : (
                      product.name?.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2>{product.name}</h2>
                    <p>{product.category} - {(product.sku || product._id?.slice(-6) || "").toUpperCase()}</p>
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
                    <th>Rating</th>
                    <th>Orders</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = getStatus(product);

                    return (
                      <tr key={product._id || product.id}>
                        <td>{product.name}</td>
                        <td>{(product.sku || product._id?.slice(-6) || "").toUpperCase()}</td>
                        <td>{product.category}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={`product-status ${status.toLowerCase().replace(" ", "-")}`}>
                            {status}
                          </span>
                        </td>
                        <td>{Number(product.rating || 0).toFixed(1)}</td>
                        <td>{product.ordersCount || 0}</td>
                        <td className="vendor-table-actions">
                          <button disabled={saving} type="button" className="table-action" onClick={() => startEdit(product)}>Edit</button>
                          <button disabled={saving} type="button" className="table-action" onClick={() => handleDelete(product)}>Delete</button>
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

      {editingProduct && editForm ? (
        <div className="vendor-modal-backdrop" role="presentation">
          <form className="vendor-modal vendor-product-edit-modal" onSubmit={saveEdit}>
            <div className="vendor-modal-heading">
              <div>
                <p className="vendor-kicker">Edit product</p>
                <h2>{editingProduct.name}</h2>
              </div>
              <button type="button" onClick={() => setEditingProduct(null)}>Close</button>
            </div>

            <div className="vendor-form vendor-form-compact">
              <label className="vendor-field"><span>Product Name</span><input required value={editForm.name} onChange={(event) => updateEditField("name", event.target.value)} /></label>
              <label className="vendor-field"><span>Brand</span><input required value={editForm.brand} onChange={(event) => updateEditField("brand", event.target.value)} /></label>
              <label className="vendor-field vendor-field-wide"><span>Description</span><textarea required value={editForm.description} onChange={(event) => updateEditField("description", event.target.value)} /></label>
              <label className="vendor-field"><span>Price</span><input required min="0" type="number" value={editForm.price} onChange={(event) => updateEditField("price", event.target.value)} /></label>
              <label className="vendor-field"><span>Discount</span><input min="0" max="100" type="number" value={editForm.discount} onChange={(event) => updateEditField("discount", event.target.value)} /></label>
              <label className="vendor-field"><span>Category</span><input required value={editForm.category} onChange={(event) => updateEditField("category", event.target.value)} /></label>
              <label className="vendor-field"><span>Stock Quantity</span><input required min="0" type="number" value={editForm.stock} onChange={(event) => updateEditField("stock", event.target.value)} /></label>
              <label className="vendor-field"><span>SKU</span><input value={editForm.sku} onChange={(event) => updateEditField("sku", event.target.value)} /></label>
              <label className="vendor-field"><span>Status</span><select value={editForm.status} onChange={(event) => updateEditField("status", event.target.value)}><option value="Live">Live</option><option value="Draft">Draft</option><option value="Hidden">Hidden</option></select></label>
              <label className="vendor-field"><span>Sizes</span><input value={editForm.sizes} placeholder="S, M, L" onChange={(event) => updateEditField("sizes", event.target.value)} /></label>
              <label className="vendor-field"><span>Colors</span><input value={editForm.colors} placeholder="Black, Red" onChange={(event) => updateEditField("colors", event.target.value)} /></label>
              <label className="vendor-field vendor-field-wide"><span>Tags</span><input value={editForm.tags} placeholder="premium, handmade, new" onChange={(event) => updateEditField("tags", event.target.value)} /></label>

              <label className="vendor-upload">
                <span>Product Images</span>
                <strong>Upload replacement or extra photos</strong>
                <small>Existing images stay unless removed below.</small>
                <input accept="image/*" multiple type="file" onChange={handleEditImageUpload} />
              </label>

              {editForm.images.length > 0 ? (
                <div className="vendor-image-preview-grid">
                  {editForm.images.map((image) => (
                    <div className="vendor-image-preview" key={image}>
                      <img src={image} alt="Product preview" />
                      <button type="button" onClick={() => removeEditImage(image)}>Remove</button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="vendor-form-actions">
                <button type="button" onClick={() => setEditingProduct(null)}>Cancel</button>
                <button disabled={saving} type="submit">{saving ? "Saving..." : "Save Product"}</button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

export default VendorProductsPage;
