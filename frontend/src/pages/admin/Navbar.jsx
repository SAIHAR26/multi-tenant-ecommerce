function Navbar() {
  return (
    <header className="admin-navbar">
      <label className="admin-search" htmlFor="admin-search">
        <span>Search</span>
        <input id="admin-search" type="search" placeholder="Search orders, vendors, products..." />
      </label>

      <div className="navbar-actions">
        <button className="icon-button" type="button" aria-label="Open notifications">
          N
          <span className="notification-dot" />
        </button>

        <div className="profile-card" aria-label="Admin profile">
          <div className="profile-avatar">VH</div>
          <div>
            <strong>V SHOP Admin</strong>
            <span>Founder workspace</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
