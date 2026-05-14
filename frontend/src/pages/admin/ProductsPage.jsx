const products = [
  { name: "Noir Leather Tote", vendor: "Luxe Lane", stock: 84, status: "Live", sales: "₹24.8L" },
  { name: "Urban Runner Pro", vendor: "Redline Studio", stock: 62, status: "Live", sales: "₹18.6L" },
  { name: "Matte Utility Jacket", vendor: "Urban Vault", stock: 29, status: "Review", sales: "₹16.2L" },
  { name: "Chrome Wallet", vendor: "Chrome House", stock: 118, status: "Pending", sales: "₹7.8L" },
];

function ProductsPage() {
  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Product management</p>
          <h1>Control marketplace catalog quality.</h1>
          <p>Manage inventory, review listings, and track high-performing product drops.</p>
        </div>
        <button className="hero-action" type="button">Add Product</button>
      </section>

      <section className="management-grid">
        <article className="glass-panel orders-panel">
          <div className="panel-header">
            <div><p className="admin-eyebrow">Catalog</p><h2>Product management preview</h2></div>
            <input className="panel-search" type="search" placeholder="Search products..." />
          </div>
          <div className="orders-table-wrap">
            <table className="orders-table">
              <thead><tr><th>Product</th><th>Vendor</th><th>Stock</th><th>Status</th><th>Sales</th></tr></thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.name}>
                    <td>{product.name}</td><td>{product.vendor}</td><td>{product.stock}</td>
                    <td><span className={`status-badge status-badge--${product.status.toLowerCase()}`}>{product.status}</span></td>
                    <td>{product.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-panel">
          <div className="panel-header"><div><p className="admin-eyebrow">Inventory</p><h2>Stock alerts</h2></div></div>
          <div className="product-list">
            {products.slice(0, 3).map((product) => (
              <div className="product-row" key={product.name}>
                <div className="product-thumb">{product.name.slice(0, 2)}</div>
                <div><h3>{product.name}</h3><p>{product.vendor}</p></div>
                <div className="product-meta"><strong>{product.stock}</strong><span>units</span></div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

export default ProductsPage;
