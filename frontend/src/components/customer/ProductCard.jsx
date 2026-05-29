import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../useToast";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";
import { getProductImage } from "../../utils/productImages";

function ProductCard({ product = {}, allProducts = [] }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  void allProducts;

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const productId = product?._id || product?.id;
  const productImage = getProductImage(product);
  const formattedPrice = new Intl.NumberFormat("en-IN").format(product?.price || 0);

  const goToDetails = () => {
    if (!productId) return;
    navigate(`/customer/product/${productId}`);
  };

  const goToQuickView = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId) return;
    navigate(`/customer/product/${productId}`);
  };

  const handleAddToWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      setIsAddingToWishlist(true);
      await addToWishlist(product);
      showToast("Product added to wishlist");
    } catch (err) {
      showToast(err.message || "Unable to add product to wishlist", "error");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product);
      showToast("Product added to cart");
      navigate("/customer/cart");
    } catch (err) {
      showToast(err.message || "Unable to add product to cart", "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <article className="customer-product-card">
      <div className="customer-product-card__image">
        <button className="customer-product-card__image-button" type="button" onClick={goToDetails}>
          <img src={productImage} alt={product?.name || "Product"} />
          <span>{product?.discount || 0}% off</span>
        </button>

        <button
          className="wishlist-action"
          type="button"
          aria-label="Add to wishlist"
          disabled={isAddingToWishlist}
          onClick={handleAddToWishlist}
        >
          Heart
        </button>
      </div>

      <div className="customer-product-card__body">
        <div>
          <button className="customer-product-card__title" type="button" onClick={goToDetails}>
            {product?.name || "Product"}
          </button>
          <p>{product?.brand || product?.storeId?.storeName || "V SHOP"}</p>
        </div>

        <div className="customer-product-card__meta">
          <strong>Rs {formattedPrice}</strong>
          <span>{product?.rating || 4} stars</span>
        </div>

        <div className="customer-product-card__actions">
          <button className="customer-secondary-button" type="button" onClick={goToQuickView}>
            Quick View
          </button>

          <button
            className="customer-primary-button"
            type="button"
            disabled={isAddingToCart}
            onClick={handleAddToCart}
          >
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
