const sidebarItems = [
  { label: "Dashboard", icon: "DB", active: true },
  { label: "Products", icon: "PR" },
  { label: "Add Product", icon: "AP" },
  { label: "Orders", icon: "OR" },
  { label: "Reviews", icon: "RW" },
  { label: "Revenue", icon: "RV" },
  { label: "Analytics", icon: "AN" },
  { label: "Settings", icon: "ST" },
  { label: "Logout", icon: "LO" },
];

function VendorSidebar() {
  return (
    <aside className="vendor-sidebar">
      <div className="vendor-brand">
        <div className="vendor-brand-mark">VS</div>
        <div>
          <strong>V SHOP</strong>
          <span>Vendor Studio</span>
        </div>
      </div>

      <nav className="vendor-sidebar-nav" aria-label="Vendor dashboard">
        {sidebarItems.map((item) => (
          <button
            type="button"
            key={item.label}
            className={`vendor-sidebar-link ${item.active ? "is-active" : ""}`}
          >
            <span className="vendor-sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default VendorSidebar;
