const fields = [
  "Product Name",
  "Price",
  "Discount",
  "Category",
  "Sizes",
  "Colors",
  "Material",
  "Brand",
  "Delivery Estimate",
  "Return Policy",
  "Stock Quantity",
];

function VendorAddProductPage() {
  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Catalog builder</p>
          <h1>Add Product</h1>
          <span>Create a polished listing with inventory, variants, and delivery rules.</span>
        </div>
      </section>

      {/* Product listing form mirrors a real vendor catalog workflow. */}
      <form className="vendor-form" onSubmit={(event) => event.preventDefault()}>
        <label className="vendor-field vendor-field-wide">
          <span>Description</span>
          <textarea placeholder="Describe materials, fit, finish, packaging, and premium details." />
        </label>

        {fields.map((field) => (
          <label className="vendor-field" key={field}>
            <span>{field}</span>
            <input type={field.includes("Price") || field.includes("Discount") || field.includes("Stock") ? "number" : "text"} placeholder={field} />
          </label>
        ))}

        <label className="vendor-upload vendor-field-wide">
          <span>Upload Images</span>
          <input type="file" multiple />
          <strong>Drop product images or browse files</strong>
          <small>Use sharp gallery images for the best V SHOP listing quality.</small>
        </label>

        <div className="vendor-form-actions">
          <button type="button">Save Draft</button>
          <button type="submit">Publish Product</button>
        </div>
      </form>
    </>
  );
}

export default VendorAddProductPage;
