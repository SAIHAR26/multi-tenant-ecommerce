import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductCard from "../../components/customer/ProductCard";
import { products } from "./customerData";
import "./ProductDetails.css";

const sizes = ["S", "M", "L", "XL"];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loadedProductId, setLoadedProductId] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => products.find((item) => String(item.id) === String(id)), [id]);

  const similarProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter((item) => item.id !== product.id)
      .map((item) => ({
        ...item,
        relevance:
          (item.category === product.category ? 4 : 0) +
          (item.vendor === product.vendor ? 3 : 0) +
          (item.brand === product.brand ? 2 : 0) +
          item.rating / 10,
      }))
      .sort((first, second) => second.relevance - first.relevance)
      .slice(0, 4);
  }, [product]);

  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }

    return [product.image, ...similarProducts.slice(0, 3).map((item) => item.image)];
  }, [product, similarProducts]);

  const [selectedImage, setSelectedImage] = useState("");
  const isLoading = loadedProductId !== String(id);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setSelectedImage(product?.image || "");
      setLoadedProductId(String(id));
    }, 350);

    return () => window.clearTimeout(timerId);
  }, [id, product]);

  if (isLoading) {
    return (
      <div className="product-details-state">
        <div className="product-details-loader" />
        <h1>Loading product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-state product-details-state--empty">
        <h1>Product not found</h1>
        <p>This product is not available in the V SHOP catalog right now.</p>
        <button className="customer-primary-button" type="button" onClick={() => navigate("/customer")}>
          Back to Products
        </button>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-IN").format(product.price);
  const originalPrice = Math.round(product.price / (1 - product.discountPercent / 100));
  const formattedOriginalPrice = new Intl.NumberFormat("en-IN").format(originalPrice);
  const reviewCount = product.popularity + product.id * 7;
  const stockCount = ((product.id * 9) % 38) + 4;
  const availability = stockCount > 10 ? "In stock" : "Only a few left";

  return (
    <div className="product-details-page">
      <section className="product-details-shell">
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img src={selectedImage || product.image} alt={product.name} />
          </div>

          <div className="product-gallery__thumbs" aria-label="Product image gallery">
            {galleryImages.map((image, index) => (
              <button
                className={image === selectedImage ? "product-gallery__thumb is-active" : "product-gallery__thumb"}
                type="button"
                key={`${product.id}-thumb-${index}`}
                onClick={() => setSelectedImage(image)}
              >
                <img src={image} alt={`${product.name} thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <article className="product-info-panel">
          <div className="product-info-panel__header">
            <p className="customer-eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            <span>by {product.brand}</span>
          </div>

          <div className="product-rating-row">
            <strong aria-label={`${product.rating} out of 5 stars`}>{renderStars(product.rating)}</strong>
            <span>{product.rating} rating</span>
            <span>{reviewCount} reviews</span>
          </div>

          <div className="product-price-block">
            <strong>Rs {formattedPrice}</strong>
            <span>Rs {formattedOriginalPrice}</span>
            <p>{product.discountPercent}% off</p>
          </div>

          <div className="product-status-grid">
            <div>
              <span>Availability</span>
              <strong>{availability}</strong>
              <small>{stockCount} pieces ready</small>
            </div>
            <div>
              <span>Vendor</span>
              <strong>{product.vendor}</strong>
              <small>Verified seller</small>
            </div>
          </div>

          <div className="product-description">
            <h2>Product Description</h2>
            <p>
              {product.name} from {product.brand} is a premium {product.category.toLowerCase()} pick curated for
              modern V SHOP customers. It combines polished styling, reliable quality, and seller-backed service from
              {` ${product.vendor}`} with protected checkout, careful packaging, and smooth delivery updates.
            </p>
          </div>

          <div className="product-size-section">
            <h2>Select Size</h2>
            <div className="product-size-options">
              {sizes.map((size) => (
                <button
                  className={selectedSize === size ? "is-selected" : ""}
                  type="button"
                  key={size}
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
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => Math.min(stockCount, value + 1))}>
                +
              </button>
            </div>
          </div>

          <div className="product-action-row">
            <button className="product-action product-action--primary" type="button">
              Add to Cart
            </button>
            <button className="product-action product-action--solid" type="button">
              Buy Now
            </button>
            <button className="product-action product-action--outline" type="button">
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

        {similarProducts.length ? (
          <div className="marketplace-product-grid marketplace-product-grid--lane">
            {similarProducts.map((item) => (
              <ProductCard product={item} key={item.id} />
            ))}
          </div>
        ) : (
          <div className="product-details-state product-details-state--inline">
            <h2>No similar products found</h2>
          </div>
        )}
      </section>
    </div>
  );
}

function renderStars(rating) {
  const roundedRating = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) => (index < roundedRating ? "★" : "☆")).join("");
}

export default ProductDetails;
