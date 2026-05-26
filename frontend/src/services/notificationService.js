import { apiRequest } from "../api/client";
import { getSavedUser } from "../api/auth";

const getAudienceParams = () => {
  const user = getSavedUser();
  const params = new URLSearchParams();

  if (user?.role) {
    params.set("role", user.role);
  }

  if (user?.id) {
    params.set("userId", user.id);
  }

  return params;
};

export const getNotifications = async (filter = "all", options = {}) => {
  const params = getAudienceParams();
  params.set("filter", filter);

  const data = await apiRequest(
    `/api/notifications?${params.toString()}`,
    options,
    "Notifications could not be loaded."
  );

  return {
    notifications: Array.isArray(data?.notifications)
      ? data.notifications
      : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [],
    unreadCount: data?.unreadCount || 0,
  };
};

export const createNotification = async (payload) => {
  return apiRequest(
    "/api/notifications",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    "Notification could not be created."
  );
};

export const markNotificationRead = async (id) => {
  return apiRequest(
    `/api/notifications/${id}/read`,
    {
      method: "PATCH",
    },
    "Notification could not be marked as read."
  );
};

export const markNotificationAsRead = markNotificationRead;

export const markAllNotificationsRead = async () => {
  const params = getAudienceParams();

  return apiRequest(
    `/api/notifications/read-all?${params.toString()}`,
    {
      method: "PATCH",
    },
    "Notifications could not be marked as read."
  );
};

export const deleteNotification = async (id) => {
  return apiRequest(
    `/api/notifications/${id}`,
    {
      method: "DELETE",
    },
    "Notification could not be deleted."
  );
};
