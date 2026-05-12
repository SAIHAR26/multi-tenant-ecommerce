1. USERS
username
fullname
email
password
confirm password
age
gender
location
role (ADMIN / VENDOR / CUSTOMER)
2. STORES
storeId
vendorId (User reference)
storeName
3. PRODUCTS
productId
storeId
name
price
stock
4. CART
cartId
userId
productId
quantity
5. ORDERS
orderId
userId
totalAmount
status (PROCESSING / SHIPPED / DELIVERED)
6. PAYMENTS
paymentId
orderId
method (COD / ONLINE)
status
7. REVIEWS
reviewId
userId
productId
rating
comment