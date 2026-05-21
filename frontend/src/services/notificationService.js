export const getNotifications = async () => {
  return [
    {
      id: 1,
      title: "Order Shipped",
      message: "Your order has been shipped successfully.",
      isRead: false,
    },
    {
      id: 2,
      title: "New Offer",
      message: "Flat 20% discount available today.",
      isRead: true,
    },
  ];
};

export const markNotificationAsRead = async (id) => {
  return {
    success: true,
    id,
  };
};