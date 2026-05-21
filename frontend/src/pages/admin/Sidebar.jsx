import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: "D", path: "/admin", end: true },
  { label: "Vendors", icon: "V", path: "/admin/vendors" },
  { label: "Customers", icon: "C", path: "/admin/customers" },
  { label: "Products", icon: "P", path: "/admin/products" },
  { label: "Orders", icon: "O", path: "/admin/orders" },
  { label: "Analytics", icon: "A", path: "/admin/analytics" },
  { label: "Reviews", icon: "R", path: "/admin/reviews" },
  { label: "Payments", icon: "₹", path: "/admin/payments" },
  { label: "Notifications", icon: "N", path: "/admin/notifications" },
  { label: "Settings", icon: "S", path: "/admin/settings" },
];

function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" to="/">
        <span className="admin-brand__mark">V</span>
        <span>
          V SHOP
          <small>Admin OS</small>
        </span>
      </Link>

      <nav className="admin-nav" aria-label="Admin navigation">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `admin-nav__item${isActive ? " admin-nav__item--active" : ""}`
            }
            end={item.end}
            key={item.label}
            to={item.path}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-upgrade">
        <p>Marketplace health</p>
        <strong>98.2%</strong>
        <span>All systems stable</span>
      </div>
    </aside>
  );
}

export default Sidebar;
