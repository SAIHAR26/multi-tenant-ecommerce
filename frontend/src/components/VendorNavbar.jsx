import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedUser, logout } from "../api/auth";
import {
  getVendorNotifications,
  getVendorStore,
  markVendorNotificationRead,
} from "../services/vendorService";

const getInitials = (value = "Vendor") =>
  value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatNotificationTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

function VendorNavbar() {
  const navigate = useNavigate();
  const [savedUser] = useState(() => getSavedUser());
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const [store, setStore] = useState(null);
  const [profile, setProfile] = useState(savedUser);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getVendorStore(), getVendorNotifications()])
      .then(([storeData, notificationData]) => {
        if (!isMounted) return;
        setStore(storeData?.store || null);
        setProfile(storeData?.user || savedUser);
        setNotifications(notificationData?.notifications || []);
        setUnreadCount(notificationData?.unreadCount || 0);
      })
      .catch(() => {
        if (isMounted) {
          setNotifications([]);
          setUnreadCount(0);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [savedUser]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const markAsRead = async (notificationId) => {
    await markVendorNotificationRead(notificationId);
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
    setUnreadCount((current) => Math.max(current - 1, 0));
  };

  const storeName = store?.storeName || savedUser?.store?.name || savedUser?.name || "Vendor Store";
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="vendor-navbar">
      <div className="vendor-store-info">
        <span>Store Name</span>
        <strong>{storeName}</strong>
      </div>

      <label className="vendor-search">
        <span>Search</span>
        <input type="search" placeholder="Search products, orders, customers" />
      </label>

      <div className="vendor-navbar-actions">
        <div className="vendor-notification-menu" ref={notificationRef}>
          <button
            className="vendor-notification"
            type="button"
            aria-expanded={notificationsOpen}
            aria-label="Notifications"
            onClick={() => setNotificationsOpen((current) => !current)}
          >
            NT
            {unreadCount > 0 ? <span>{unreadCount > 9 ? "9+" : unreadCount}</span> : null}
          </button>

          {notificationsOpen ? (
            <div className="vendor-notification-dropdown">
              <div className="vendor-dropdown-heading">
                <strong>Notifications</strong>
                <small>{unreadCount} unread</small>
              </div>

              {notifications.length === 0 ? (
                <div className="vendor-empty-dropdown">No notifications yet.</div>
              ) : (
                notifications.map((notification) => (
                  <button
                    className={`vendor-notification-item ${notification.isRead ? "" : "is-unread"}`}
                    key={notification._id}
                    type="button"
                    onClick={() => markAsRead(notification._id)}
                  >
                    <strong>{notification.title || notification.type}</strong>
                    <span>{notification.message}</span>
                    <small>{formatNotificationTime(notification.createdAt)}</small>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>

        <div className="vendor-profile-menu" ref={profileRef}>
          <button
            className="vendor-profile"
            type="button"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((current) => !current)}
          >
            <span className="vendor-avatar">
              {profile?.avatar ? <img src={profile.avatar} alt={storeName} /> : getInitials(storeName)}
            </span>
            <span>
              <strong>Vendor Profile</strong>
              <small>{storeName}</small>
            </span>
          </button>

          {profileOpen ? (
            <div className="vendor-profile-dropdown">
              <strong>{storeName}</strong>
              <span>Premium seller account</span>
              <button type="button" onClick={() => navigate("/vendor/store-profile")}>View Store</button>
              <button type="button" onClick={() => navigate("/vendor/settings")}>Account Settings</button>
              <button type="button" onClick={handleLogout}>Logout</button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default VendorNavbar;
