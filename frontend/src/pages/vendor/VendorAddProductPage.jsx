import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedUser } from "../../api/auth";
import { createProduct } from "../../services/productService";

const initialForm = {
  name: "",
  description: "",
  price: "",
  discount: "",
  category: "",
  sizes: "",
  colors: "",
  material: "",
  brand: "",
  deliveryEstimate: "",
  returnPolicy: "",
  stock: "",
  images: "",
};

function VendorAddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const buildPayload = (status) => {
    const user = getSavedUser();

    return {
      name: form.name,
      description: form.description,
      price: Number(form.price || 0),
      discount: Number(form.discount || 0),
      category: form.category,
      brand: form.brand,
      stock: Number(form.stock || 0),
      status,
      vendor: user?.id,
      storeId: user?.store?.storeId,
      sizes: form.sizes.split(",").map((item) => item.trim()).filter(Boolean),
      colors: form.colors.split(",").map((item) => item.trim()).filter(Boolean),
      tags: [form.material, form.deliveryEstimate, form.returnPolicy].filter(Boolean),
      images: form.images
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean),
    };
  };

  const handleSubmit = async (event, status = "Live") => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await createProduct(buildPayload(status));
      setMessage(response.message || "Product created successfully");
      setForm(initialForm);
      setTimeout(() => navigate("/vendor/products"), 650);
    } catch (err) {
      setError(err.message || "Product could not be created");
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
          <span>Create a polished listing with inventory, variants, and delivery rules.</span>
        </div>
      </section>

      {(message || error) && (
        <p className={error ? "vendor-action-status vendor-action-status--error" : "vendor-action-status"}>
          {error || message}
        </p>
      )}

      <form className="vendor-form" onSubmit={(event) => handleSubmit(event, form.status || "Live")}>
        <label className="vendor-field vendor-field-wide">
          <span>Description</span>
          <textarea
            required
            placeholder="Describe materials, fit, finish, packaging, and premium details."
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>

        <VendorField label="Product Name" value={form.name} onChange={(value) => updateField("name", value)} required />
        <VendorField label="Price" type="number" value={form.price} onChange={(value) => updateField("price", value)} required />
        <VendorField label="Discount" type="number" value={form.discount} onChange={(value) => updateField("discount", value)} />
        <VendorField label="Category" value={form.category} onChange={(value) => updateField("category", value)} required />
        <VendorField label="Sizes" value={form.sizes} onChange={(value) => updateField("sizes", value)} />
        <VendorField label="Colors" value={form.colors} onChange={(value) => updateField("colors", value)} />
        <VendorField label="Material" value={form.material} onChange={(value) => updateField("material", value)} />
        <VendorField label="Brand" value={form.brand} onChange={(value) => updateField("brand", value)} required />
        <VendorField label="Delivery Estimate" value={form.deliveryEstimate} onChange={(value) => updateField("deliveryEstimate", value)} />
        <VendorField label="Return Policy" value={form.returnPolicy} onChange={(value) => updateField("returnPolicy", value)} />
        <VendorField label="Stock Quantity" type="number" value={form.stock} onChange={(value) => updateField("stock", value)} />

        <label className="vendor-field vendor-field-wide">
          <span>Image URLs</span>
          <textarea
            placeholder="Paste one image URL per line"
            value={form.images}
            onChange={(event) => updateField("images", event.target.value)}
          />
        </label>

        <div className="vendor-form-actions">
          <button type="button" disabled={saving} onClick={(event) => handleSubmit(event, "Draft")}>
            Save Draft
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "Publishing..." : "Publish Product"}
          </button>
        </div>
      </form>
    </>
  );
}

function VendorField({ label, onChange, required = false, type = "text", value }) {
  return (
    <label className="vendor-field">
      <span>{label}</span>
      <input
        required={required}
        type={type}
        placeholder={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export default VendorAddProductPage;
