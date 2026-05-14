function ProductCard({ product, onQuickView }) {
  const formattedPrice = new Intl.NumberFormat("en-IN").format(product.price);

  return (
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
          <button className="customer-secondary-button" type="button" onClick={() => onQuickView?.(product)}>
            Quick View
          </button>
          <button className="customer-primary-button" type="button">Add to Cart</button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
