import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedUser } from "../../api/auth";

function CustomerNavbar() {
  const navigate = useNavigate();
  const user = getSavedUser();
  const customerName = user?.name || "Customer";
  const [searchValue, setSearchValue] = useState("");
  const initials = customerName
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    navigate(query ? `/customer?search=${encodeURIComponent(query)}` : "/customer");
  };

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
          <span className="customer-badge">3</span>
        </button>
        <button
          className="customer-icon-button"
          type="button"
          aria-label="Open notifications"
          title="Notifications"
          onClick={() => navigate("/customer/notifications")}
        >
          N
          <span className="customer-dot" />
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
