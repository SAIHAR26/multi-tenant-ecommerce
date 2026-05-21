import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import {
  getProductById,
  getProducts,
} from "../../services/productService";
import "./ProductDetails.css";

const sizes = ["S", "M", "L", "XL"];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        const productData = await getProductById(id);
        const allProducts = await getProducts();

        const currentProduct =
          productData.product || productData;

        const productsArray = Array.isArray(allProducts.products)
          ? allProducts.products
          : Array.isArray(allProducts)
          ? allProducts
          : [];

        setProduct(currentProduct);
        setProducts(productsArray);

        setSelectedImage(
          currentProduct?.image ||
            "https://via.placeholder.com/400"
        );
      } catch (err) {
        console.log(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const similarProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter((item) => item._id !== product._id)
      .slice(0, 4);
  }, [product, products]);

  const galleryImages = useMemo(() => {
    if (!product) return [];

    return [
      product.image ||
        "https://via.placeholder.com/400",
      ...similarProducts.map(
        (item) =>
          item.image ||
          "https://via.placeholder.com/400"
      ),
    ];
  }, [product, similarProducts]);

  if (loading) {
    return (
      <div className="product-details-state">
        <h1>Loading product...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-details-state">
        <h1>{error}</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-state">
        <h1>Product not found</h1>

        <button
          type="button"
          onClick={() => navigate("/customer")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-IN").format(product.price || 0);
  const stockCount = product.stock || 10;

  const availability =
    stockCount > 10
      ? "In Stock"
      : "Only Few Left";

  return (
    <div className="product-details-page">
      <section className="product-details-shell">
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img
              src={selectedImage}
              alt={product.name}
            />
          </div>

          <div className="product-gallery__thumbs">
            {galleryImages.map((image, index) => (
              <button
                key={index}
                type="button"
                className={
                  image === selectedImage
                    ? "product-gallery__thumb is-active"
                    : "product-gallery__thumb"
                }
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={`thumb-${index}`} />
              </button>
            ))}
          </div>
        </div>

        <article className="product-info-panel">
          <div className="product-info-panel__header">
            <p className="customer-eyebrow">
              {product.category || "Fashion"}
            </p>

            <h1>{product.name}</h1>

            <span>
              by {product.brand || "V SHOP"}
            </span>
          </div>

          <div className="product-price-block">
            <strong>₹{formattedPrice}</strong>
          </div>

          <div className="product-status-grid">
            <div>
              <span>Availability</span>
              <strong>{availability}</strong>
              <small>{stockCount} pieces ready</small>
            </div>

            <div>
              <span>Vendor</span>
              <strong>
                {product.vendor?.storeName || "V SHOP"}
              </strong>
              <small>Verified seller</small>
            </div>
          </div>

          <div className="product-description">
            <h2>Product Description</h2>
            <p>
              {product.description ||
                `${product.name} available in V SHOP marketplace.`}
            </p>
          </div>

          <div className="product-size-section">
            <h2>Select Size</h2>
            <div className="product-size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={
                    selectedSize === size ? "is-selected" : ""
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-quantity-section">
            <h2>Quantity</h2>

            <div className="product-quantity-control">
              <button
                onClick={() =>
                  setQuantity((prev) => Math.max(1, prev - 1))
                }
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity((prev) =>
                    Math.min(stockCount, prev + 1)
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="product-action-row">
            <button className="product-action product-action--primary">
              Add to Cart
            </button>

            <button className="product-action product-action--solid">
              Buy Now
            </button>

            <button className="product-action product-action--outline">
              Add to Wishlist
            </button>
          </div>
        </article>
      </section>

      <section className="similar-products-section">
        <div className="customer-panel__header">
          <div>
            <p className="customer-eyebrow">Recommended</p>
            <h2>Similar Products</h2>
          </div>

          <span>{similarProducts.length} picks</span>
        </div>

        {similarProducts.length > 0 ? (
          <div className="marketplace-product-grid marketplace-product-grid--lane">
            {similarProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                allProducts={products}  // ✅ THIS IS THE FIX
              />
            ))}
          </div>
        ) : (
          <div className="product-details-state">
            <h2>No similar products found</h2>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductDetails;