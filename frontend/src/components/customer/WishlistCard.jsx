function WishlistCard({ item, onMoveToCart, onRemove }) {
  const product = item.product || item;
  const price =
    typeof product.price === "number"
      ? `Rs ${new Intl.NumberFormat("en-IN").format(product.price)}`
      : product.price;

  return (
    <article className="wishlist-card">
      <img src={product.image} alt={product.name} />
      <div>
        <h3>{product.name}</h3>
        <p>{product.vendor || product.brand}</p>
        <strong>{price}</strong>
      </div>
      <div className="customer-product-card__actions">
        <button className="customer-secondary-button" type="button" onClick={() => onRemove?.(item)}>
          Remove
        </button>
        <button className="customer-primary-button" type="button" onClick={() => onMoveToCart?.(item)}>
          Move to Cart
        </button>
      </div>
    </article>
  );
}

export default WishlistCard;
