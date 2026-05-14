function WishlistCard({ item }) {
  const price = typeof item.price === "number" ? `Rs ${new Intl.NumberFormat("en-IN").format(item.price)}` : item.price;

  return (
    <article className="wishlist-card">
      <img src={item.image} alt={item.name} />
      <div>
        <h3>{item.name}</h3>
        <p>{item.vendor}</p>
        <strong>{price}</strong>
      </div>
      <button className="customer-secondary-button" type="button">Move to Cart</button>
    </article>
  );
}

export default WishlistCard;
