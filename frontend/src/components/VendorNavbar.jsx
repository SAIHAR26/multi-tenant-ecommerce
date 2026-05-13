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

        <details className="vendor-profile-menu">
          <summary className="vendor-profile">
            <span className="vendor-avatar">VA</span>
            <span>
              <strong>Vendor Profile</strong>
              <small>Crimson Atelier</small>
            </span>
          </summary>

          <div className="vendor-profile-dropdown">
            <strong>Crimson Atelier</strong>
            <span>Premium seller account</span>
            <button type="button">View Store</button>
            <button type="button">Account Settings</button>
          </div>
        </details>
      </div>
    </header>
  );
}

export default VendorNavbar;
