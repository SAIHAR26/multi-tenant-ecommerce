import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedUser } from "../../api/auth";
import { useToast } from "../useToast";
import { addToCart } from "../../services/cartService";
import { createReview } from "../../services/reviewService";
import { addToWishlist } from "../../services/wishlistService";
import { getProductImage } from "../../utils/productImages";

function ProductCard({ product = {}, allProducts = [] }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  void allProducts;

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const productId = product?._id || product?.id;
  const productImage = getProductImage(product);
  const formattedPrice = new Intl.NumberFormat("en-IN").format(product?.price || 0);
  const productVendor = product?.brand || product?.storeId?.storeName || "V SHOP";
  const productDescription =
    product?.description || `${product?.name || "This product"} is available in V SHOP marketplace.`;
  const stockCount = Number(product?.stock || 0);
  const savedUser = getSavedUser();

  const goToDetails = () => {
    if (!productId) return;
    navigate(`/customer/product/${productId}`);
  };

  const openQuickView = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!productId) {
      showToast("Product is not ready for review", "error");
      return;
    }

    if (!savedUser?.id) {
      showToast("Please login before adding a review", "error");
      return;
    }

    if (!reviewComment.trim()) {
      showToast("Please add a comment with your rating", "error");
      return;
    }

    try {
      setIsSubmittingReview(true);
      await createReview({
        userId: savedUser.id,
        productId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewRating(5);
      setReviewComment("");
      showToast("Review added");
    } catch (err) {
      showToast(err.message || "Unable to add review", "error");
    } finally {
      setIsSubmittingReview(false);
    }
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
    <>
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
          <button className="customer-secondary-button" type="button" onClick={openQuickView}>
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

    {isQuickViewOpen ? (
      <div className="quick-view-backdrop" role="presentation" onClick={closeQuickView}>
        <section
          className="quick-view"
          role="dialog"
          aria-modal="true"
          aria-label={`${product?.name || "Product"} quick view`}
          onClick={(event) => event.stopPropagation()}
        >
          <button className="quick-view__close" type="button" onClick={closeQuickView}>
            X
          </button>

          <div className="quick-view__media">
            <img src={productImage} alt={product?.name || "Product"} />
          </div>

          <div className="quick-view__content">
            <div className="quick-view__header">
              <p className="customer-eyebrow">{product?.category || "Marketplace"}</p>
              <h2>{product?.name || "Product"}</h2>
              <p>{productDescription}</p>
            </div>

            <div className="quick-view__price-row">
              <strong>Rs {formattedPrice}</strong>
              <span>{product?.rating || 4} stars</span>
              <span>{product?.discount || 0}% off</span>
            </div>

            <div className="quick-view__vendor">
              <strong>{productVendor}</strong>
              <span>{stockCount > 0 ? `${stockCount} in stock` : "Stock status updating"}</span>
              <p>{product?.storeId?.storeDescription || "Verified V SHOP seller"}</p>
            </div>

            <form className="quick-view__review-form" onSubmit={handleReviewSubmit}>
              <div className="quick-view__section-title">
                <h3>Add your review</h3>
                <span>{reviewRating} stars</span>
              </div>

              <div className="quick-view__rating-options" aria-label="Choose rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={rating <= reviewRating ? "is-selected" : ""}
                    aria-label={`${rating} star rating`}
                    onClick={() => setReviewRating(rating)}
                  >
                    {rating <= reviewRating ? "★" : "☆"}
                  </button>
                ))}
              </div>

              <label className="quick-view__comment-field">
                <span>Comment</span>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="Share what you liked about this product"
                  rows={4}
                />
              </label>

              <div className="quick-view__actions">
                <button
                  className="customer-primary-button"
                  type="submit"
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button className="customer-secondary-button" type="button" onClick={goToDetails}>
                  Full Details
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    ) : null}
    </>
  );
}

export default ProductCard;
