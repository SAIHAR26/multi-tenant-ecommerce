import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedUser } from "../../api/auth";
import { getCartItems } from "../../services/cartService";
import { getNotifications } from "../../services/notificationService";
import { saveSearchSignal } from "../../utils/searchSignals";

function CustomerNavbar() {
  const navigate = useNavigate();
  const user = getSavedUser();
  const customerName = user?.name || "Customer";
  const [searchValue, setSearchValue] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const initials = customerName
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (query) {
      saveSearchSignal(query);
    }

    navigate(query ? `/customer?search=${encodeURIComponent(query)}` : "/customer");
  };

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      getCartItems({ skipAuthRedirect: true }),
      getNotifications("all", { skipAuthRedirect: true }),
    ])
      .then(([cartResult, notificationResult]) => {
        if (!isMounted) return;

        if (cartResult.status === "fulfilled") {
          setCartCount(
            cartResult.value.reduce((total, item) => total + Number(item.quantity || 1), 0)
          );
        }

        if (notificationResult.status === "fulfilled") {
          setUnreadCount(Number(notificationResult.value?.unreadCount || 0));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="customer-navbar">
      <form className="customer-search" onSubmit={handleSearch} role="search">
        <label htmlFor="customer-search">
          Search
        </label>
        <input
          id="customer-search"
          type="search"
          placeholder="Search luxury products, vendors, orders..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        <button className="customer-search__button" type="submit">
          Search
        </button>
      </form>

      <div className="customer-navbar__actions">
        <button
          className="customer-icon-button"
          type="button"
          aria-label="Open wishlist"
          title="Wishlist"
          onClick={() => navigate("/customer/wishlist")}
        >
          W
        </button>
        <button
          className="customer-icon-button"
          type="button"
          aria-label="Open cart"
          title="Cart"
          onClick={() => navigate("/customer/cart")}
        >
          C
          {cartCount > 0 ? <span className="customer-badge">{cartCount}</span> : null}
        </button>
        <button
          className="customer-icon-button"
          type="button"
          aria-label="Open notifications"
          title="Notifications"
          onClick={() => navigate("/customer/notifications")}
        >
          N
          {unreadCount > 0 ? <span className="customer-dot" /> : null}
        </button>

        <button
          className="customer-profile-chip"
          type="button"
          aria-label="Open customer profile"
          title="Profile"
          onClick={() => navigate("/customer/profile")}
        >
          <span className="customer-profile-chip__avatar">{initials}</span>
          <div>
            <strong>{customerName}</strong>
            <span>Gold member</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default CustomerNavbar;
