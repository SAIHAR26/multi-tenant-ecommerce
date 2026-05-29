import { useEffect, useState } from "react";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import {
  getVendorNotifications,
  markVendorNotificationRead,
} from "../../services/vendorService";

function VendorNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getVendorNotifications()
      .then((data) => {
        if (isMounted) setNotifications(data?.notifications || []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Notifications could not be loaded.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const markAsRead = async (id) => {
    await markVendorNotificationRead(id);
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  return (
    <>
      <section className="vendor-page-header">
        <div>
          <p className="vendor-kicker">Notification center</p>
          <h1>Notifications</h1>
          <span>Read seller alerts, product activity, order changes, and review signals.</span>
        </div>
      </section>

      {loading ? <LoadingState message="Loading notifications..." /> : null}
      {!loading && error ? <ErrorState title="Unable to load notifications" message={error} /> : null}
      {!loading && !error && notifications.length === 0 ? (
        <ErrorState title="No notifications" message="No vendor notifications exist yet." />
      ) : null}

      {!loading && !error && notifications.length > 0 ? (
        <section className="orders-section vendor-full-panel">
          <div className="orders-list">
            {notifications.map((notification) => (
              <article className="order-card" key={notification._id}>
                <div>
                  <span>{notification.isRead ? "Read" : "Unread"}</span>
                  <strong>{notification.title || notification.type}</strong>
                  <small>{notification.message}</small>
                </div>
                <button className="table-action" type="button" onClick={() => markAsRead(notification._id)}>
                  Mark read
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

export default VendorNotificationsPage;
