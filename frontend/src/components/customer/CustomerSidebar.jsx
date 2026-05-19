import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: "D", path: "/customer", end: true },
  { label: "Wishlist", icon: "W", path: "/customer/wishlist" },
  { label: "Cart", icon: "C", path: "/customer/cart" },
  { label: "Checkout", icon: "CK", path: "/customer/checkout" },
  { label: "Orders", icon: "O", path: "/customer/orders" },
  { label: "Tracking", icon: "T", path: "/customer/tracking" },
  { label: "Notifications", icon: "N", path: "/customer/notifications" },
  { label: "Recommendations", icon: "R", path: "/customer/recommendations" },
  { label: "Profile", icon: "P", path: "/customer/profile" },
  { label: "Settings", icon: "S", path: "/customer/settings" },
];

function CustomerSidebar() {
  return (
    <aside className="customer-sidebar">
      <Link className="customer-brand" to="/">
        <span className="customer-brand__mark">V</span>
        <span>
          V SHOP
          <small>Customer Suite</small>
        </span>
      </Link>

      <nav className="customer-nav" aria-label="Customer dashboard navigation">
        {navItems.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `customer-nav__item${isActive ? " customer-nav__item--active" : ""}`
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

      <button className="customer-logout" type="button">
        <span>L</span>
        Logout
      </button>
    </aside>
  );
}

export default CustomerSidebar;
