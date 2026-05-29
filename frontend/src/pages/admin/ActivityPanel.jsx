import { useEffect, useState } from "react";
import { getNotifications } from "../../services/notificationService";

const formatRelativeTime = (dateValue) => {
  const timestamp = new Date(dateValue || Date.now()).getTime();
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  return `${Math.round(hours / 24)} day ago`;
};

function ActivityPanel() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getNotifications("all", { skipAuthRedirect: true })
      .then((data) => {
        if (!isMounted) return;

        setActivities(
          (data.notifications || []).slice(0, 5).map((notification) => ({
            title: notification.title || "Marketplace update",
            detail: notification.message,
            time: formatRelativeTime(notification.createdAt),
          }))
        );
        setError("");
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message || "Activity feed could not be loaded.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <article className="glass-panel activity-panel">
      <div className="panel-header">
        <div>
          <p className="admin-eyebrow">Recent activities</p>
          <h2>Operations pulse</h2>
        </div>
      </div>

      {error ? <div className="notification-state notification-state--error">{error}</div> : null}
      {!error && activities.length === 0 ? <div className="notification-state">No recent activity</div> : null}

      <div className="activity-list">
        {activities.map((activity) => (
          <div className="activity-item" key={activity.title + activity.time}>
            <span className="activity-dot" />
            <div>
              <h3>{activity.title}</h3>
              <p>{activity.detail}</p>
              <time>{activity.time}</time>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default ActivityPanel;
