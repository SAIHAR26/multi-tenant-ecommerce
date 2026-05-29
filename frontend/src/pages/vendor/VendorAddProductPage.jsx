import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVendorProduct } from "../../services/vendorService";

const initialForm = {
  name: "",
  description: "",
  price: "",
  discount: "",
  category: "",
  brand: "",
  stock: "",
  sku: "",
  images: "",
  sizes: "",
  colors: "",
  tags: "",
  status: "Live",
};

function VendorAddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event, status = form.status) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await createVendorProduct({
        ...form,
        status,
        price: Number(form.price || 0),
        discount: Number(form.discount || 0),
        stock: Number(form.stock || 0),
        images: form.images.split(/[\n,]/).map((item) => item.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((item) => item.trim()).filter(Boolean),
        colors: form.colors.split(",").map((item) => item.trim()).filter(Boolean),
        tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
      });
      navigate("/vendor/products");
    } catch (err) {
      setError(err.message || "Product could not be created.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Catalog builder</p>
          <h1>Add Product</h1>
          <span>Create a listing with inventory, variants, and live store assignment.</span>
        </div>
      </section>

      <form className="vendor-form" onSubmit={handleSubmit}>
        {error ? <p className="vendor-form-error">{error}</p> : null}

        <label className="vendor-field">
          <span>Product Name</span>
          <input required value={form.name} onChange={(event) => updateField("name", event.target.value)} />
        </label>

        <label className="vendor-field">
          <span>Brand</span>
          <input required value={form.brand} onChange={(event) => updateField("brand", event.target.value)} />
        </label>

        <label className="vendor-field vendor-field-wide">
          <span>Description</span>
          <textarea required value={form.description} onChange={(event) => updateField("description", event.target.value)} />
        </label>

        <label className="vendor-field">
          <span>Price</span>
          <input required min="0" type="number" value={form.price} onChange={(event) => updateField("price", event.target.value)} />
        </label>

        <label className="vendor-field">
          <span>Discount</span>
          <input min="0" max="100" type="number" value={form.discount} onChange={(event) => updateField("discount", event.target.value)} />
        </label>

        <label className="vendor-field">
          <span>Category</span>
          <input required value={form.category} onChange={(event) => updateField("category", event.target.value)} />
        </label>

        <label className="vendor-field">
          <span>Stock Quantity</span>
          <input required min="0" type="number" value={form.stock} onChange={(event) => updateField("stock", event.target.value)} />
        </label>

        <label className="vendor-field">
          <span>SKU</span>
          <input value={form.sku} onChange={(event) => updateField("sku", event.target.value)} />
        </label>

        <label className="vendor-field">
          <span>Status</span>
          <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
            <option value="Live">Live</option>
            <option value="Draft">Draft</option>
            <option value="Hidden">Hidden</option>
          </select>
        </label>

        <label className="vendor-field">
          <span>Sizes</span>
          <input value={form.sizes} placeholder="S, M, L" onChange={(event) => updateField("sizes", event.target.value)} />
        </label>

        <label className="vendor-field">
          <span>Colors</span>
          <input value={form.colors} placeholder="Black, Red" onChange={(event) => updateField("colors", event.target.value)} />
        </label>

        <label className="vendor-field vendor-field-wide">
          <span>Image URLs</span>
          <textarea value={form.images} placeholder="Paste one image URL per line" onChange={(event) => updateField("images", event.target.value)} />
        </label>

        <label className="vendor-field vendor-field-wide">
          <span>Tags</span>
          <input value={form.tags} placeholder="premium, handmade, new" onChange={(event) => updateField("tags", event.target.value)} />
        </label>

        <div className="vendor-form-actions">
          <button disabled={saving} type="button" onClick={(event) => handleSubmit(event, "Draft")}>
            Save Draft
          </button>
          <button disabled={saving} type="submit">
            {saving ? "Publishing..." : "Publish Product"}
          </button>
        </div>
      </form>
    </>
  );
}

export default VendorAddProductPage;
