import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import EmptyState from "../components/common/EmptyState";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
     try {
  const data = await getProducts();
  setProducts(data);
   } catch {
         setError("Failed to load products");
   } finally {
        setLoading(false);
   }
    };

    fetchProducts();
  }, []);

   if (loading) {
  return <h2>Loading products...</h2>;
}
if (error) {
  return <h2>{error}</h2>;
}
  if (products.length === 0) {
    return <EmptyState message="No products found" />;
  }

  return (
    <div>
      <h1>Products</h1>

      {products.map((product) => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductsPage;