import { NavLink } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", icon: "DB", to: "/vendor", end: true },
  { label: "Products", icon: "PR", to: "/vendor/products" },
  { label: "Add Product", icon: "AP", to: "/vendor/add-product" },
  { label: "Orders", icon: "OR", to: "/vendor/orders" },
  { label: "Reviews", icon: "RW", to: "/vendor/reviews" },
  { label: "Revenue", icon: "RV", to: "/vendor/revenue" },
  { label: "Analytics", icon: "AN", to: "/vendor/analytics" },
  { label: "Settings", icon: "ST", to: "/vendor/settings" },
  { label: "Logout", icon: "LO", to: "/login" },
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
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `vendor-sidebar-link ${isActive ? "is-active" : ""}`
            }
          >
            <span className="vendor-sidebar-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default VendorSidebar;
