function CustomerNavbar() {
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
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
            alt="Customer profile"
          />
          <div>
            <strong>Anaya Rao</strong>
            <span>Gold member</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default CustomerNavbar;
