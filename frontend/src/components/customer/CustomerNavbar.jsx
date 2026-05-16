import { getSavedUser } from "../../api/auth";

function CustomerNavbar() {
  const user = getSavedUser();
  const customerName = user?.name || "Customer";
  const initials = customerName
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="customer-navbar">
      <label className="customer-search" htmlFor="customer-search">
        <span>Search</span>
        <input id="customer-search" type="search" placeholder="Search luxury products, vendors, orders..." />
      </label>

      <div className="customer-navbar__actions">
        <button className="customer-icon-button" type="button" aria-label="Open wishlist">
          W
        </button>
        <button className="customer-icon-button" type="button" aria-label="Open cart">
          C
          <span className="customer-badge">3</span>
        </button>
        <button className="customer-icon-button" type="button" aria-label="Open notifications">
          N
          <span className="customer-dot" />
        </button>

        <div className="customer-profile-chip" aria-label="Customer profile">
          <span className="customer-profile-chip__avatar">{initials}</span>
          <div>
            <strong>{customerName}</strong>
            <span>Gold member</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default CustomerNavbar;
