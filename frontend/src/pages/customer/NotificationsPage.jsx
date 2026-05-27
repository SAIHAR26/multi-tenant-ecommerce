import { useEffect, useState } from "react";
import { getSavedUser } from "../../api/auth";
import {
  getNotifications,
  markNotificationAsRead,
} from "../../services/notificationService";

function NotificationsPage() {
  const user = getSavedUser();
  const customerName = user?.name || "Customer";

  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();

        const notificationsArray = Array.isArray(
          data?.notifications
        )
          ? data.notifications
          : Array.isArray(data)
          ? data
          : [];

        setNotifications(notificationsArray);
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const handleOpenNotification = async (
    notification
  ) => {
    setSelectedNotification(notification);

    if (!notification.isRead) {
      try {
        await markNotificationAsRead(
          notification._id
        );

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
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
          <p className="customer-eyebrow">
            Notifications
          </p>

          <h1>Your V SHOP updates.</h1>

          <p>
            Read important messages from admin,
            order alerts, and account updates in
            one place.
          </p>
        </div>

        <span className="customer-pill">
          {unreadCount} new
        </span>
      </section>

      <section className="customer-content-grid customer-content-grid--notifications">
        <article className="customer-panel">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">
                Inbox
              </p>

              <h2>Recent notifications</h2>
            </div>
          </div>

          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <button
                key={notification._id}
                className={`notification-card ${
                  selectedNotification?._id ===
                  notification._id
                    ? "notification-card--active"
                    : ""
                }`}
                type="button"
                onClick={() =>
                  handleOpenNotification(
                    notification
                  )
                }
              >
                <span className="notification-card__icon">
                  {notification.sender?.[0] || "A"}
                </span>

                <div>
                  <p>
                    {notification.sender ||
                      "Admin"}
                  </p>

                  <h3>{notification.title}</h3>

                  <span>
                    {notification.preview ||
                      notification.message}
                  </span>
                </div>

                <time>
                  {notification.time ||
                    "Just now"}
                </time>
              </button>
            ))
          ) : (
            <div className="notification-empty" style={{ textAlign: "center", padding: "40px 10px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔔</div>
              <h3>All caught up!</h3>
              <p style={{ color: "#888", fontSize: "14px" }}>
                You don't have any new alerts or system updates right now.
              </p>
            </div>
          )}
        </article>

        <article className="customer-panel notification-message-panel">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">
                Message
              </p>

              <h2>
                {selectedNotification
                  ? selectedNotification.title
                  : "Select a notification"}
              </h2>
            </div>
          </div>

          {selectedNotification ? (
            <div className="notification-message">
              <span className="notification-message__badge">
                From{" "}
                {selectedNotification.sender ||
                  "V SHOP"}
              </span>

              <h3>
                Hello {customerName},
              </h3>

              <p>
                {selectedNotification.message}
              </p>

              <button
                className="customer-primary-button"
                type="button"
                onClick={() =>
                  setSelectedNotification(null)
                }
              >
                Close Message
              </button>
            </div>
          ) : (
            <div className="notification-empty">
              <span>N</span>

              <h3>
                Click a notification
              </h3>

              <p>
                Notification details will open
                here.
              </p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

export default NotificationsPage;