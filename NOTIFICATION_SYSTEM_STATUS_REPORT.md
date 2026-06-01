# Notification System Status Report

## MongoDB Integration Status

- Notifications are stored in MongoDB through `backend/models/Notification.js`.
- New notification records include `userId`, `role`, `title`, `message`, `type`, `read`/`isRead`, `createdAt`, `relatedEntity`, and `actionUrl`.
- New generation uses `backend/services/notificationService.js` to create user-linked, role-scoped notifications and avoid short-window duplicates.
- Retrieval, unread count, mark read, mark all read, delete, type filtering, and latest-first sorting are handled by `/api/notifications`.

## Admin Notification Events

- New vendor registration.
- Vendor account approved.
- New customer registration.
- New product added.
- Product updated.
- Product deleted.
- New order created.
- Order status changed.
- Order cancelled.
- Payment successful.
- New review added.
- Low stock or out-of-stock product detected.
- Report generated.
- New customer segment created.

## Vendor Notification Events

- Vendor account approved.
- Vendor account rejected.
- New order received.
- Order status changed.
- Order cancelled.
- Product review added.
- Product low stock.
- Product out of stock.

## Customer Notification Events

- Account created and welcome message.
- New product in relevant categories or wishlist/order interest signals.
- New order created.
- Order status changed.
- Order cancelled.
- Payment successful.

## Frontend Status

- Admin notification page supports unread count, filters, search, mark read, mark all read, delete, latest-first API data, empty state, and action URL opening.
- Customer notification page supports unread count, filters, search, mark read, mark all read, empty state, and action URL opening.
- Vendor notification dropdown/page support unread count, mark read, empty state, latest notifications, and action URL opening.

## Remaining Notification Gaps

- Real-time push updates are not implemented; current behavior is API fetch based.
- Refund-specific events need dedicated refund/payment workflow endpoints before they can be generated automatically.
- Vendor suspension/reactivation and customer suspension/reactivation need admin account-status endpoints before notifications can be generated.
- Customer questions/inquiries, store/revenue milestones, coupons, loyalty rewards, festival sales, price-drop, and back-in-stock workflows need source features before notification hooks can be attached.
- System error notifications need a central error-monitoring hook before they can be generated reliably.
