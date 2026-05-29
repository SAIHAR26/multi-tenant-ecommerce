import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getNotifications } from "../../services/notificationService";

function Navbar() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    getNotifications()
      .then((data) => {
        if (isMounted) {
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUnreadCount(0);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="admin-navbar">
      <form
        className="admin-search"
        onSubmit={(event) => {
          event.preventDefault();
          const query = searchTerm.trim();
          if (query) {
            navigate(`/admin/products?search=${encodeURIComponent(query)}`);
          }
        }}
      >
        <span>Search</span>
        <input
          id="admin-search"
          type="search"
          placeholder="Search orders, vendors, products..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </form>

      <div className="navbar-actions">
        <Link className="icon-button" to="/admin/notifications" aria-label="Open notifications">
          N
          {unreadCount > 0 ? (
            <span className="notification-count">{unreadCount > 9 ? "9+" : unreadCount}</span>
          ) : null}
        </Link>

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
