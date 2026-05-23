import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { useToast } from "../../components/useToast";

import {
  getCartItems,
  removeFromCart,
} from "../../services/cartService";

const getItemId = (item) =>
  item._id ||
  item.id ||
  item.productId ||
  item.product?._id;

const getProduct = (item) =>
  item.product || item;

function CartPage() {
  const { showToast } =
    useToast();

  const [cartItems, setCartItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // FETCH CART
  useEffect(() => {
    let isMounted = true;

    async function fetchCart() {
      try {
        setLoading(true);

        const data =
          await getCartItems();

        if (!isMounted) return;

        const safeCartItems =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.items)
            ? data.items
            : [];

        setCartItems(safeCartItems);

        setError("");
      } catch (err) {
        if (isMounted) {
          setError(
            err.message ||
              "Unable to load cart"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCart();

    return () => {
      isMounted = false;
    };
  }, []);

  // REMOVE ITEM
  const handleRemove = async (
    id
  ) => {
    try {
      await removeFromCart(id);

      setCartItems((prev) =>
        prev.filter(
          (item) =>
            getItemId(item) !== id
        )
      );

      showToast(
        "Item removed from cart"
      );
    } catch (err) {
      showToast(
        err.message ||
          "Could not remove item",
        "error"
      );
    }
  };

  // CALCULATIONS
  const subtotal = cartItems.reduce(
    (acc, item) => {
      const product =
        getProduct(item);

      const price =
        Number(product?.price) || 0;

      const quantity =
        Number(item?.quantity) || 1;

      return (
        acc + price * quantity
      );
    },
    0
  );

  const discount =
    subtotal > 0 ? 3200 : 0;

  const total =
    subtotal - discount;

  // LOADING
  if (loading) {
    return (
      <div className="customer-page">
        <LoadingState message="Loading cart..." />
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="customer-page">
        <ErrorState
          title="Cart Error"
          message={error}
        />
      </div>
    );
  }

  // EMPTY CART
  if (
    !cartItems ||
    cartItems.length === 0
  ) {
    return (
      <div className="customer-page">
        <section className="customer-hero customer-hero--compact">
          <div>
            <p className="customer-eyebrow">
              Cart Status
            </p>

            <h1>
              Your cart is empty
            </h1>

            <p>
              Add products to begin
              shopping.
            </p>
          </div>

          <Link
            to="/customer"
            className="customer-primary-button"
          >
            Browse Products
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="customer-page">
      {/* HERO */}
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">
            Cart
          </p>

          <h1>
            Your selected products
          </h1>

          <p>
            Review products and
            continue to checkout.
          </p>
        </div>

        <Link
          to="/customer/checkout"
          className="customer-primary-button cart-checkout-link"
        >
          Checkout
        </Link>
      </section>

      {/* MAIN CONTENT */}
      <section className="customer-content-grid">
        {/* CART ITEMS */}
        <article className="customer-panel">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">
                Cart Items
              </p>

              <h2>
                Ready to buy
              </h2>
            </div>

            <span className="customer-pill">
              {cartItems.length} items
            </span>
          </div>

          <div className="wishlist-list">
            {cartItems.map((item) => {
              const product =
                getProduct(item);

              const id =
                getItemId(item);

              return (
                <div
                  className="wishlist-card"
                  key={
                    id ||
                    product?.name
                  }
                >
                  {/* PRODUCT IMAGE */}
                  {product?.image ? (
                    <img
                      src={product.image}
                      alt={
                        product?.name ||
                        "Product"
                      }
                    />
                  ) : (
                    <div className="product-no-image">
                      No Image
                    </div>
                  )}

                  {/* PRODUCT INFO */}
                  <div>
                    <h3>
                      {product?.name ||
                        "Unnamed Product"}
                    </h3>

                    <p>
                      {product?.vendor ||
                        product?.brand ||
                        "Unknown Brand"}
                    </p>

                    <strong>
                      Rs{" "}
                      {Number(
                        product?.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <span>
                      Qty:{" "}
                      {item?.quantity ||
                        1}
                    </span>
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    type="button"
                    className="customer-secondary-button"
                    onClick={() =>
                      handleRemove(id)
                    }
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </article>

        {/* SUMMARY */}
        <article className="customer-panel">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">
                Summary
              </p>

              <h2>
                Order total
              </h2>
            </div>
          </div>

          <div className="offer-stack">
            <div>
              <strong>
                Subtotal
              </strong>

              <span>
                Rs{" "}
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <div>
              <strong>
                Discount
              </strong>

              <span>
                Rs{" "}
                {discount.toLocaleString(
                  "en-IN"
                )}{" "}
                saved
              </span>
            </div>

            <div>
              <strong>Total</strong>

              <span>
                Rs{" "}
                {total > 0
                  ? total.toLocaleString(
                      "en-IN"
                    )
                  : 0}
              </span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default CartPage;