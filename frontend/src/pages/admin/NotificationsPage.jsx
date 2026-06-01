import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationService";

const filters = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Orders", value: "ORDER" },
  { label: "Products", value: "PRODUCT" },
  { label: "Reviews", value: "REVIEW" },
  { label: "Payments", value: "PAYMENT" },
  { label: "System", value: "SYSTEM" },
];

function NotificationsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async (filter = activeFilter) => {
    try {
      const data = await getNotifications(filter);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (requestError) {
      setError(requestError.message || "Notifications could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getNotifications(activeFilter)
      .then((data) => {
        if (isMounted) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
          setError("");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Notifications could not be loaded.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

  const heading = useMemo(() => {
    const filter = filters.find((item) => item.value === activeFilter);
    return filter?.label || "All";
  }, [activeFilter]);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    await loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    await loadNotifications();
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    await loadNotifications();
  };

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
    if (!notification.isRead) {
      await markNotificationRead(notification._id);
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      return;
    }

    await loadNotifications();
  };

  return (
    <div className="admin-page">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <p className="admin-eyebrow">Admin alerts</p>
          <h1>Notifications</h1>
          <p>Review vendor registrations, order movement, payments, reviews, customer activity, and system updates.</p>
        </div>

        <button className="hero-action" type="button" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
          Mark all read
        </button>
      </section>

      <section className="glass-panel">
        <div className="panel-header">
          <div>
            <p className="admin-eyebrow">{heading}</p>
            <h2>{unreadCount} unread notifications</h2>
          </div>

          <div className="notification-filters" aria-label="Notification filters">
            <input
              className="filter-chip"
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {filters.map((filter) => (
              <button
                className={activeFilter === filter.value ? "filter-chip filter-chip--active" : "filter-chip"}
                key={filter.value}
                type="button"
                onClick={() => {
                  setLoading(true);
                  setActiveFilter(filter.value);
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? <div className="notification-state">Loading notifications...</div> : null}
        {error ? <div className="notification-state notification-state--error">{error}</div> : null}
        {!loading && !error && visibleNotifications.length === 0 ? (
          <div className="notification-state">No notifications</div>
        ) : null}

        {!loading && !error && visibleNotifications.length > 0 ? (
          <div className="notification-list">
            {visibleNotifications.map((notification) => (
              <article
                className={`notification-card${notification.isRead ? "" : " notification-card--unread"}`}
                key={notification._id}
              >
                <div className="notification-card__icon">{notification.type.slice(0, 1).toUpperCase()}</div>

                <div>
                  <div className="notification-card__top">
                    <h3>{notification.title}</h3>
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                  <p>{notification.message}</p>
                  <span className={`notification-type notification-type--${notification.type}`}>
                    {notification.type}
                  </span>
                </div>

                <div className="notification-actions">
                  {!notification.isRead ? (
                    <button type="button" onClick={() => handleMarkRead(notification._id)}>
                      Mark read
                    </button>
                  ) : null}
                  {notification.actionUrl ? (
                    <button type="button" onClick={() => handleOpenNotification(notification)}>
                      Open
                    </button>
                  ) : null}
                  <button type="button" onClick={() => handleDelete(notification._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default NotificationsPage;
