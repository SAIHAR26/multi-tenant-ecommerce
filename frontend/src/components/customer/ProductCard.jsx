import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "../../pages/customer/customerData";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [localPreviewProduct, setLocalPreviewProduct] = useState(null);
  const formattedPrice = new Intl.NumberFormat("en-IN").format(product.price);
  const handleQuickView = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setLocalPreviewProduct((currentProduct) => (currentProduct ? null : product));
  };

  return (
    <article className="customer-product-card">
        <div className="customer-product-card__image">
          <button
            className="customer-product-card__image-button"
            type="button"
            onClick={() => navigate(`/customer/product/${product.id}`)}
          >
            <img src={product.image} alt={product.name} />
            <span>{product.discountPercent}% off</span>
          </button>
          <button
            className="wishlist-action"
            type="button"
            aria-label={`Add ${product.name} to wishlist`}
          >
            Heart
          </button>
        </div>

        <div className="customer-product-card__body">
          <div>
            <button
              className="customer-product-card__title"
              type="button"
              onClick={() => navigate(`/customer/product/${product.id}`)}
            >
              {product.name}
            </button>
            <p>{product.brand}</p>
          </div>
          <div className="customer-product-card__meta">
            <strong>Rs {formattedPrice}</strong>
            <span>{product.rating} star</span>
          </div>
          <div className="customer-product-card__actions">
            <button
              className="customer-secondary-button"
              type="button"
              onClick={handleQuickView}
            >
              Quick View
            </button>
            <button className="customer-primary-button" type="button" onClick={() => navigate("/customer/cart")}>
              Add to Cart
            </button>
          </div>
        </div>

      {localPreviewProduct ? (
        <LocalProductQuickView
          product={localPreviewProduct}
          onClose={() => setLocalPreviewProduct(null)}
          onViewDetails={(productId = product.id) => navigate(`/customer/product/${productId}`)}
        />
      ) : null}
    </article>
  );
}

function LocalProductQuickView({ product, onClose, onViewDetails }) {
  const [quantity, setQuantity] = useState(1);
  const formattedPrice = new Intl.NumberFormat("en-IN").format(product.price);
  const productDetails = getProductDetails(product);
  const reviews = getProductReviews(product);
  const suggestedProducts = getSuggestedProducts(product);
  const stockStatus = productDetails.stock > 10 ? "In stock" : productDetails.stock > 0 ? "Low stock" : "Sold out";

  return (
    <section
      className="quick-view-popover"
      aria-label={`${product.name} quick view`}
      role="region"
    >
      <button className="quick-view__close" type="button" aria-label="Close quick view" onClick={onClose}>
        X
      </button>

      <div className="quick-view-popover__media">
        <img src={product.image} alt={product.name} />
        <div className="quick-view-popover__thumbs" aria-label="Product images">
          {productDetails.images.map((image, index) => (
            <img src={image} alt={`${product.name} view ${index + 1}`} key={`${product.id}-preview-${index}`} />
          ))}
        </div>
      </div>

      <div className="quick-view-popover__content">
        <div className="quick-view-popover__header">
          <p className="customer-eyebrow">{product.category}</p>
          <h2>{product.name}</h2>
          <p>{productDetails.description}</p>
        </div>

        <div className="quick-view-popover__meta">
          <strong>Rs {formattedPrice}</strong>
          <span>{product.discountPercent}% off</span>
          <span>{product.rating} star rating</span>
        </div>

        <div className="quick-view-popover__info-grid">
          <div>
            <span>Vendor</span>
            <strong>{product.vendor}</strong>
            <small>{productDetails.vendorDetails}</small>
          </div>
          <div>
            <span>Stock</span>
            <strong className={productDetails.stock > 0 ? "stock-ok" : "stock-empty"}>{stockStatus}</strong>
            <small>{productDetails.stock} units available</small>
          </div>
        </div>

        <div className="quick-view-popover__quantity">
          <span>Quantity</span>
          <div>
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
              -
            </button>
            <strong>{quantity}</strong>
            <button type="button" onClick={() => setQuantity((value) => Math.min(productDetails.stock, value + 1))}>
              +
            </button>
          </div>
        </div>

        <div className="quick-view-popover__actions">
          <button className="customer-primary-button" type="button" disabled={productDetails.stock === 0}>
            Add to Cart
          </button>
          <button className="customer-secondary-button" type="button" onClick={onViewDetails}>
            View Details
          </button>
        </div>

        <div className="quick-view-popover__reviews">
          <div className="quick-view-popover__section-title">
            <h3>Reviews</h3>
            <span>{reviews.length} customer reviews</span>
          </div>
          {reviews.map((review) => (
            <article key={`${product.id}-${review.author}`}>
              <div>
                <strong>{review.author}</strong>
                <span>{review.rating} star</span>
              </div>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>

        <div className="quick-view-popover__suggested">
          <div className="quick-view-popover__section-title">
            <h3>Suggested Products</h3>
            <span>Similar picks</span>
          </div>
          <div>
            {suggestedProducts.map((suggestion) => (
              <button
                className="quick-view-popover__suggestion"
                type="button"
                key={suggestion.id}
                onClick={() => onViewDetails(suggestion.id)}
              >
                <img src={suggestion.image} alt={suggestion.name} />
                <span>{suggestion.brand}</span>
                <strong>{suggestion.name}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function getProductDetails(product) {
  const stock = ((product.id * 7) % 34) + 3;
  const images = [product.image, ...productsByCategory(product.category).slice(0, 2).map((item) => item.image)];

  return {
    stock,
    images,
    description: `${product.name} from ${product.brand} is a premium ${product.category.toLowerCase()} pick by ${product.vendor}, selected for everyday comfort, polished styling, and reliable quality.`,
    vendorDetails: `${product.vendor} is a verified V SHOP seller with fast dispatch, protected payments, and category-specialist support.`,
  };
}

function getProductReviews(product) {
  const reviewTemplates = [
    `The ${product.category.toLowerCase()} quality feels premium and the finish matches the product photos.`,
    `Bought this from ${product.vendor}; packaging was neat and delivery updates were clear.`,
    `Good value for the price. I liked the ${product.brand} styling and would consider similar products.`,
  ];

  return reviewTemplates.map((comment, index) => ({
    author: ["Anaya R.", "Karthik M.", "Meera S."][index],
    rating: Math.max(4, Number((product.rating - index * 0.2).toFixed(1))),
    comment,
  }));
}

function getSuggestedProducts(product) {
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
    .sort((first, second) => second.relevance - first.relevance || second.rating - first.rating)
    .slice(0, 3);
}

function productsByCategory(category) {
  return products.filter((item) => item.category === category);
}

export default ProductCard;
