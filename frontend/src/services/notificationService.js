import { apiRequest } from "../api/client";

export const getNotifications = async (filter = "all") => {
  return apiRequest(`/api/notifications?filter=${filter}`, {}, "Notifications could not be loaded.");
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

export const markAllNotificationsRead = async () => {
  return apiRequest(
    "/api/notifications/read-all",
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
