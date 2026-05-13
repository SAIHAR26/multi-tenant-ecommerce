function VendorNavbar() {
  return (
    <header className="vendor-navbar">
      <div className="vendor-store-info">
        <span>Store Name</span>
        <strong>Crimson Atelier</strong>
      </div>

      <label className="vendor-search">
        <span>Search</span>
        <input type="search" placeholder="Search products, orders, customers" />
      </label>

      <div className="vendor-navbar-actions">
        <button className="vendor-notification" type="button" aria-label="Notifications">
          NT
          <span />
        </button>

        <button className="vendor-profile" type="button">
          <span className="vendor-avatar">VA</span>
          <span>
            <strong>Vendor Profile</strong>
            <small>Dropdown</small>
          </span>
        </button>
      </div>
    </header>
  );
}

export default VendorNavbar;
