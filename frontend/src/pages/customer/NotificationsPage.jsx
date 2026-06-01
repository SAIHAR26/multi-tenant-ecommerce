import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedUser } from "../../api/auth";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationAsRead,
} from "../../services/notificationService";

const filters = ["all", "unread", "ORDER", "PAYMENT", "PRODUCT", "PROMOTION"];

function NotificationsPage() {
  const navigate = useNavigate();
  const user = getSavedUser();
  const customerName = user?.name || "Customer";
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getNotifications(activeFilter)
      .then((data) => {
        if (isMounted) {
          setNotifications(data?.notifications || []);
          setError("");
        }
      })
      .catch(() => {
        if (isMounted) setError("Failed to load notifications");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setLoading(true);
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const visibleNotifications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return notifications;

    return notifications.filter((notification) =>
      [notification.title, notification.message, notification.type]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [notifications, searchTerm]);

  const handleOpenNotification = async (notification) => {
    setSelectedNotification(notification);

    if (!notification.isRead) {
      await markNotificationAsRead(notification._id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === notification._id ? { ...item, isRead: true } : item))
      );
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  if (loading) {
    return (
      <div className="customer-page">
        <h2 style={{ padding: "20px" }}>Loading notifications...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-page">
        <h2 style={{ padding: "20px", color: "red" }}>{error}</h2>
      </div>
    );
  }

  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Notifications</p>
          <h1>Your V SHOP updates.</h1>
          <p>Read order alerts, account updates, recommendations, and offers in one place.</p>
        </div>

        <span className="customer-pill">{unreadCount} new</span>
      </section>

      <section className="customer-content-grid customer-content-grid--notifications">
        <article className="customer-panel">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">Inbox</p>
              <h2>Recent notifications</h2>
            </div>
            <button
              className="customer-primary-button"
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
          </div>

          <div className="notification-filters">
            <input
              className="filter-chip"
              type="search"
              placeholder="Search notifications"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {filters.map((filter) => (
              <button
                className={activeFilter === filter ? "filter-chip filter-chip--active" : "filter-chip"}
                key={filter}
                type="button"
                onClick={() => handleFilterChange(filter)}
              >
                {filter === "all" ? "All" : filter === "unread" ? "Unread" : filter}
              </button>
            ))}
          </div>

          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((notification) => (
              <button
                key={notification._id}
                className={`notification-card ${
                  selectedNotification?._id === notification._id ? "notification-card--active" : ""
                }`}
                type="button"
                onClick={() => handleOpenNotification(notification)}
              >
                <span className="notification-card__icon">{notification.sender?.[0] || "V"}</span>

                <div>
                  <p>{notification.sender || "V SHOP"}</p>
                  <h3>{notification.title}</h3>
                  <span>{notification.preview || notification.message}</span>
                </div>

                <time>{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ""}</time>
              </button>
            ))
          ) : (
            <div className="notification-empty" style={{ textAlign: "center", padding: "40px 10px" }}>
              <h3>All caught up!</h3>
              <p style={{ color: "#888", fontSize: "14px" }}>
                You do not have alerts or updates matching this view right now.
              </p>
            </div>
          )}
        </article>

        <article className="customer-panel notification-message-panel">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">Message</p>
              <h2>{selectedNotification ? selectedNotification.title : "Select a notification"}</h2>
            </div>
          </div>

          {selectedNotification ? (
            <div className="notification-message">
              <span className="notification-message__badge">From {selectedNotification.sender || "V SHOP"}</span>
              <h3>Hello {customerName},</h3>
              <p>{selectedNotification.message}</p>
              <button className="customer-primary-button" type="button" onClick={() => setSelectedNotification(null)}>
                Close Message
              </button>
            </div>
          ) : (
            <div className="notification-empty">
              <span>N</span>
              <h3>Click a notification</h3>
              <p>Notification details will open here.</p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

export default NotificationsPage;
