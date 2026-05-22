# Day 12 Frontend API Gaps

| Page | Service | API status |
| --- | --- | --- |
| Customer cart | `frontend/src/services/cartService.js` | Live: `GET /api/cart`, `POST /api/cart`, and `DELETE /api/cart/:id` are implemented and verified. |
| Customer wishlist | `frontend/src/services/wishlistService.js` | Live: `GET /api/wishlist`, `POST /api/wishlist`, and `DELETE /api/wishlist/:id` are implemented and verified. |
| Product recommendations | `frontend/src/services/recommendationService.js` | Live: `GET /api/products/recommendations` is implemented and verified. |
| Vendor dashboard stats | `frontend/src/services/vendorStatsService.js` | Live: `GET /api/vendor/stats` is implemented and verified. |
| Product cards | `cartService.js`, `wishlistService.js` | Add to cart and add to wishlist now call services and show toast feedback. |
| Checkout | `cartService.js` | Checkout reads live cart data instead of local product fixture data. |
