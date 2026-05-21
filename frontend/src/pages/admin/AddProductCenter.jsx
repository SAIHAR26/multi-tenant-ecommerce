import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/client";
import { createProduct, getProducts } from "../../services/productService";

const initialForm = {
  name: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  discount: "",
  stock: "",
  storeId: "",
  vendor: "",
  sku: "",
  tags: "",
  weight: "",
  dimensions: "",
  status: "Live",
  lowStockThreshold: "5",
  restockDate: "",
  images: [],
};

const readFiles = (files) =>
  Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, src: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );

function AddProductCenter() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentTime] = useState(() => Date.now());

  useEffect(() => {
    let isActive = true;

    Promise.all([getProducts(), apiRequest("/api/store", {}, "Stores could not be loaded.")])
      .then(([productData, storeData]) => {
        if (!isActive) return;
        const loadedProducts = Array.isArray(productData.products)
          ? productData.products
          : Array.isArray(productData)
          ? productData
          : [];
        setProducts(loadedProducts);
        setStores(Array.isArray(storeData) ? storeData : []);
      })
      .catch((loadError) => {
        if (isActive) {
          setError(loadError.message);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const lowStock = products.filter((product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5).length;
    const outOfStock = products.filter((product) => Number(product.stock || 0) === 0).length;
    const newProducts = products.filter((product) => {
      if (!product.createdAt) return false;
      return currentTime - new Date(product.createdAt).getTime() < 2592000000;
    }).length;

    return {
      totalProducts: products.length,
      lowStock,
      outOfStock,
      newProducts,
    };
  }, [currentTime, products]);

  const autoWarning =
    Number(form.stock || 0) <= Number(form.lowStockThreshold || 0)
      ? "Auto stock warning enabled"
      : "Stock level healthy";

  const updateField = (field, value) => {
    if (field === "storeId") {
      if (value === "__default") {
        setForm((current) => ({ ...current, storeId: value, vendor: "" }));
        return;
      }

      const store = stores.find((item) => item._id === value);
      setForm((current) => ({ ...current, storeId: value, vendor: store?.vendorId || "" }));
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
  };

  const addImages = async (files) => {
    if (!files?.length) return;
    const images = await readFiles(files);
    setForm((current) => ({ ...current, images: [...current.images, ...images] }));
  };

  const moveImage = (fromIndex, direction) => {
    const toIndex = fromIndex + direction;
    if (toIndex < 0 || toIndex >= form.images.length) return;
    const images = [...form.images];
    const [image] = images.splice(fromIndex, 1);
    images.splice(toIndex, 0, image);
    setForm((current) => ({ ...current, images }));
  };

  const removeImage = (index) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const buildPayload = (status = form.status) => ({
    ...form,
    storeId: form.storeId === "__default" ? "" : form.storeId,
    status,
    price: Number(form.price || 0),
    discount: Number(form.discount || 0),
    stock: Number(form.stock || 0),
    lowStockThreshold: Number(form.lowStockThreshold || 0),
    images: form.images.map((image) => image.src),
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  });

  const saveProduct = async (status = form.status) => {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await createProduct(buildPayload(status));
      setMessage(response.message || "Product created successfully");
      setForm(initialForm);
      setTimeout(() => navigate("/admin/products"), 650);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const duplicateProduct = (product) => {
    setForm({
      ...initialForm,
      name: `${product.name} Copy`,
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price || "",
      discount: product.discount || "",
      stock: product.stock || "",
      storeId: product.storeId?._id || product.storeId || "",
      vendor: product.vendor?._id || product.vendor || "",
      sku: "",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      weight: product.weight || "",
      dimensions: product.dimensions || "",
      status: "Draft",
      lowStockThreshold: product.lowStockThreshold || "5",
      images: (product.images || []).map((src, index) => ({ name: `image-${index + 1}`, src })),
    });
    setMessage("Product copied into the creation form.");
  };

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Product creation</p>
          <h1>Marketplace Product Creation Center</h1>
          <p>Add and manage products across marketplace stores.</p>
        </div>
        <button className="hero-action" type="button" onClick={() => navigate("/admin/products")}>
          Back to Products
        </button>
      </section>

      <section className="stats-grid">
        <article className="dashboard-card dashboard-card--purple"><div className="dashboard-card__top"><span>Total Products</span><strong>Catalog</strong></div><h2>{stats.totalProducts}</h2><p>Marketplace listings</p></article>
        <article className="dashboard-card dashboard-card--blue"><div className="dashboard-card__top"><span>Low Stock</span><strong>Watch</strong></div><h2>{stats.lowStock}</h2><p>Below threshold</p></article>
        <article className="dashboard-card dashboard-card--cyan"><div className="dashboard-card__top"><span>Out of Stock</span><strong>Urgent</strong></div><h2>{stats.outOfStock}</h2><p>Needs replenishment</p></article>
        <article className="dashboard-card dashboard-card--violet"><div className="dashboard-card__top"><span>New Products</span><strong>30 days</strong></div><h2>{stats.newProducts}</h2><p>Recently added</p></article>
      </section>

      {(message || error) && (
        <p className={`admin-action-status ${error ? "admin-action-status--error" : "admin-action-status--success"}`}>
          {error || message}
        </p>
      )}

      <section className="product-center-grid">
        <article className="glass-panel">
          <div className="panel-header">
            <div><p className="admin-eyebrow">Create</p><h2>Product details</h2></div>
            <button className="text-button" type="button" onClick={() => setPreviewing((value) => !value)}>
              Preview Product
            </button>
          </div>

          <form className="segment-form product-center-form" onSubmit={(event) => { event.preventDefault(); saveProduct(form.status); }}>
            <label><span>Product Name</span><input required value={form.name} onChange={(event) => updateField("name", event.target.value)} /></label>
            <label><span>Description</span><textarea required value={form.description} onChange={(event) => updateField("description", event.target.value)} /></label>
            <div className="product-form-row">
              <label><span>Category</span><input required value={form.category} onChange={(event) => updateField("category", event.target.value)} /></label>
              <label><span>Brand</span><input required value={form.brand} onChange={(event) => updateField("brand", event.target.value)} /></label>
            </div>
            <div className="product-form-row">
              <label><span>Price</span><input required type="number" min="0" value={form.price} onChange={(event) => updateField("price", event.target.value)} /></label>
              <label><span>Discount</span><input type="number" min="0" max="100" value={form.discount} onChange={(event) => updateField("discount", event.target.value)} /></label>
              <label><span>Stock Quantity</span><input type="number" min="0" value={form.stock} onChange={(event) => updateField("stock", event.target.value)} /></label>
            </div>
            <div className="product-form-row">
              <label>
                <span>Store/Vendor</span>
                <select required value={form.storeId} onChange={(event) => updateField("storeId", event.target.value)}>
                  <option value="">Select store</option>
                  {stores.length === 0 && <option value="__default">V SHOP Marketplace</option>}
                  {stores.map((store) => <option key={store._id} value={store._id}>{store.storeName}</option>)}
                </select>
              </label>
              <label><span>SKU</span><input value={form.sku} onChange={(event) => updateField("sku", event.target.value)} /></label>
              <label>
                <span>Status</span>
                <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                  <option value="Live">Live</option>
                  <option value="Draft">Draft</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </label>
            </div>
            <div className="product-form-row">
              <label><span>Tags</span><input placeholder="premium, leather, new" value={form.tags} onChange={(event) => updateField("tags", event.target.value)} /></label>
              <label><span>Weight</span><input placeholder="1.2 kg" value={form.weight} onChange={(event) => updateField("weight", event.target.value)} /></label>
              <label><span>Dimensions</span><input placeholder="12 x 8 x 4 cm" value={form.dimensions} onChange={(event) => updateField("dimensions", event.target.value)} /></label>
            </div>

            <div
              className={`image-dropzone ${dragging ? "image-dropzone--active" : ""}`}
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                addImages(event.dataTransfer.files);
              }}
            >
              <strong>Product Images</strong>
              <p>Drag and drop product images or choose multiple files.</p>
              <input type="file" multiple accept="image/*" onChange={(event) => addImages(event.target.files)} />
            </div>

            <div className="image-preview-grid">
              {form.images.map((image, index) => (
                <div className="image-preview-card" key={`${image.name}-${index}`}>
                  <img src={image.src} alt={image.name} />
                  <div>
                    <button type="button" onClick={() => moveImage(index, -1)}>Up</button>
                    <button type="button" onClick={() => moveImage(index, 1)}>Down</button>
                    <button type="button" onClick={() => removeImage(index)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="product-form-row">
              <label><span>Current stock</span><input type="number" min="0" value={form.stock} onChange={(event) => updateField("stock", event.target.value)} /></label>
              <label><span>Low stock threshold</span><input type="number" min="0" value={form.lowStockThreshold} onChange={(event) => updateField("lowStockThreshold", event.target.value)} /></label>
              <label><span>Restock date</span><input type="date" value={form.restockDate} onChange={(event) => updateField("restockDate", event.target.value)} /></label>
            </div>
            <p className="inventory-warning">{autoWarning}</p>

            <div className="segment-actions">
              <button className="text-button" type="button" disabled={saving} onClick={() => saveProduct("Draft")}>Save Draft</button>
              <button className="text-button" type="button" disabled={saving} onClick={() => saveProduct("Live")}>Publish Product</button>
              <button className="hero-action" type="submit" disabled={saving}>
                {saving ? "Creating product..." : "Add Product"}
              </button>
            </div>
          </form>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Inventory</p><h2>Management tools</h2></div></div>
          {previewing && (
            <div className="product-preview-panel">
              <div className="product-thumb">{form.name.slice(0, 2) || "VP"}</div>
              <h3>{form.name || "Product preview"}</h3>
              <p>{form.description || "Preview details appear here."}</p>
              <strong>Rs {form.price || 0}</strong>
              <span className="status-badge status-badge--live">{form.status}</span>
            </div>
          )}

          <div className="product-list">
            {products.length === 0 ? (
              <div className="notification-state">No products found</div>
            ) : (
              products.slice(0, 5).map((product) => (
                <div className="product-row" key={product._id}>
                  <div className="product-thumb">{product.name?.slice(0, 2)}</div>
                  <div><h3>{product.name}</h3><p>{product.category}</p></div>
                  <button className="text-button" type="button" onClick={() => duplicateProduct(product)}>
                    Duplicate Product
                  </button>
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
}

export default AddProductCenter;
