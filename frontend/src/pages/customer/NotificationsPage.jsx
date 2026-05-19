import { useState } from "react";
import { getSavedUser } from "../../api/auth";

const adminNotification = {
  sender: "Admin",
  title: "Welcome to V SHOP",
  preview: "Your V SHOP customer account is ready.",
  message:
    "Welcome to V SHOP. We are happy to have you here. You can explore premium products, save wishlist items, track orders, and manage your profile from your customer dashboard.",
  time: "Just now",
};

function NotificationsPage() {
  const user = getSavedUser();
  const customerName = user?.name || "Customer";
  const [selectedNotification, setSelectedNotification] = useState(null);

  return (
    <div className="customer-page">
      <section className="customer-hero customer-hero--compact">
        <div>
          <p className="customer-eyebrow">Notifications</p>
          <h1>Your V SHOP updates.</h1>
          <p>Read important messages from admin, order alerts, and account updates in one place.</p>
        </div>
        <span className="customer-pill">1 new</span>
      </section>

      <section className="customer-content-grid customer-content-grid--notifications">
        <article className="customer-panel">
          <div className="customer-panel__header">
            <div>
              <p className="customer-eyebrow">Inbox</p>
              <h2>Recent notifications</h2>
            </div>
            <span className="customer-pill">Admin</span>
          </div>

          <button
            className={`notification-card${
              selectedNotification ? " notification-card--active" : ""
            }`}
            type="button"
            onClick={() => setSelectedNotification(adminNotification)}
          >
            <span className="notification-card__icon">A</span>
            <div>
              <p>{adminNotification.sender}</p>
              <h3>{adminNotification.title}</h3>
              <span>{adminNotification.preview}</span>
            </div>
            <time>{adminNotification.time}</time>
          </button>
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
              <span className="notification-message__badge">From {selectedNotification.sender}</span>
              <h3>Hello {customerName},</h3>
              <p>{selectedNotification.message}</p>
              <button
                className="customer-primary-button"
                type="button"
                onClick={() => setSelectedNotification(null)}
              >
                Close Message
              </button>
            </div>
          ) : (
            <div className="notification-empty">
              <span>N</span>
              <h3>Click the admin notification</h3>
              <p>The welcome message will open here.</p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

export default NotificationsPage;
