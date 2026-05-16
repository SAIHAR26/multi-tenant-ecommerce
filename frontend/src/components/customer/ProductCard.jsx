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

    setLocalPreviewProduct(product);
  };

  return (
    <>
      <article className="customer-product-card">
        <div className="customer-product-card__image">
          <img src={product.image} alt={product.name} />
          <span>{product.discountPercent}% off</span>
          <button className="wishlist-action" type="button" aria-label={`Add ${product.name} to wishlist`}>
            Heart
          </button>
        </div>

        <div className="customer-product-card__body">
          <div>
            <h3>{product.name}</h3>
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
              onMouseDown={handleQuickView}
              onClick={handleQuickView}
              onPointerUp={handleQuickView}
            >
              Quick View
            </button>
            <button className="customer-primary-button" type="button" onClick={() => navigate("/customer/cart")}>
              Add to Cart
            </button>
          </div>
        </div>
      </article>

      {localPreviewProduct ? (
        <LocalProductQuickView product={localPreviewProduct} onClose={() => setLocalPreviewProduct(null)} />
      ) : null}
    </>
  );
}

function LocalProductQuickView({ product, onClose }) {
  const formattedPrice = new Intl.NumberFormat("en-IN").format(product.price);
  const suggestedProducts = products
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);

  return (
    <div className="quick-view-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="quick-view"
        aria-label={`${product.name} quick view`}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="quick-view__close" type="button" aria-label="Close quick view" onClick={onClose}>
          X
        </button>

        <div className="quick-view__media">
          <img src={product.image} alt={product.name} />
          <div className="quick-view__thumbs" aria-label="Product images">
            {[product, ...suggestedProducts.slice(0, 2)].map((item) => (
              <img src={item.image} alt={item.name} key={`${product.id}-${item.id}`} />
            ))}
          </div>
        </div>

        <div className="quick-view__content">
          <div className="quick-view__header">
            <p className="customer-eyebrow">{product.category}</p>
            <h2>{product.name}</h2>
            <p>
              Premium {product.category.toLowerCase()} from {product.vendor}, selected for the V SHOP customer
              experience.
            </p>
          </div>

          <div className="quick-view__price-row">
            <strong>Rs {formattedPrice}</strong>
            <span>{product.discountPercent}% off</span>
            <span>{product.rating} star rating</span>
          </div>

          <div className="quick-view__vendor">
            <div>
              <span>Vendor</span>
              <strong>{product.vendor}</strong>
            </div>
            <p>Verified seller with protected checkout, premium packaging, and reliable dispatch.</p>
          </div>

          <div className="quick-view__actions">
            <button className="customer-primary-button" type="button">
              Add to Cart
            </button>
            <button className="customer-secondary-button" type="button">
              Save to Wishlist
            </button>
          </div>

          <div className="quick-view__suggested">
            <div className="quick-view__section-title">
              <h3>Suggested Products</h3>
              <span>Similar {product.category.toLowerCase()} picks</span>
            </div>
            <div className="quick-view__suggested-grid">
              {suggestedProducts.map((suggestion) => (
                <article className="quick-view__suggestion" key={suggestion.id}>
                  <img src={suggestion.image} alt={suggestion.name} />
                  <span>{suggestion.brand}</span>
                  <strong>{suggestion.name}</strong>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductCard;
