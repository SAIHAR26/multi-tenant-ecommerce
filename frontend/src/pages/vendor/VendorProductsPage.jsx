const products = [
  { name: "Signature Leather Tote", category: "Bags", price: "Rs. 15,699", stock: 42, status: "Live", sku: "VST-1001", image: "LT" },
  { name: "Crimson Luxe Jacket", category: "Fashion", price: "Rs. 28,299", stock: 18, status: "Live", sku: "VST-1002", image: "CJ" },
  { name: "Matte Steel Watch", category: "Accessories", price: "Rs. 21,649", stock: 9, status: "Low Stock", sku: "VST-1003", image: "SW" },
  { name: "Premium Gift Set", category: "Lifestyle", price: "Rs. 10,299", stock: 0, status: "Paused", sku: "VST-1004", image: "GS" },
];

function VendorProductsPage() {
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
          <input type="search" placeholder="Search by product, SKU, category" />
        </label>
      </section>

      <section className="vendor-products-cards">
        {products.map((product) => (
          <article className="vendor-product-card" key={product.sku}>
            <div className="product-image">{product.image}</div>
            <div>
              <h2>{product.name}</h2>
              <p>{product.category} - {product.sku}</p>
              <strong>{product.price}</strong>
            </div>
            <span className={`product-status ${product.status.toLowerCase().replace(" ", "-")}`}>
              {product.status}
            </span>
          </article>
        ))}
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
              {products.map((product) => (
                <tr key={product.sku}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`product-status ${product.status.toLowerCase().replace(" ", "-")}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="vendor-table-actions">
                    <button type="button" className="table-action">Edit</button>
                    <button type="button" className="table-action">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default VendorProductsPage;
