const products = [
  {
    name: "Signature Leather Tote",
    category: "Bags",
    price: "₹15,699",
    stock: 42,
    status: "Live",
    image: "LT",
  },
  {
    name: "Crimson Luxe Jacket",
    category: "Fashion",
    price: "₹28,299",
    stock: 18,
    status: "Live",
    image: "CJ",
  },
  {
    name: "Matte Steel Watch",
    category: "Accessories",
    price: "₹21,649",
    stock: 9,
    status: "Low Stock",
    image: "SW",
  },
  {
    name: "Premium Gift Set",
    category: "Lifestyle",
    price: "₹10,299",
    stock: 0,
    status: "Paused",
    image: "GS",
  },
];

function ProductsTable() {
  return (
    <section className="products-table-panel">
      <div className="vendor-section-heading">
        <div>
          <p>Product management</p>
          <h2>Active catalog</h2>
        </div>
        <button type="button">View all</button>
      </div>

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
            {products.map((product) => (
              <tr key={product.name}>
                <td>
                  <div className="product-image">{product.image}</div>
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`product-status ${product.status.toLowerCase().replace(" ", "-")}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <button type="button" className="table-action">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProductsTable;
