export const getCartProduct = (item) => item?.product || item || {};

export const getLineSubtotal = (item) => {
  const product = getCartProduct(item);
  return Number(product.price || 0) * (Number(item.quantity) || 1);
};

export const getLineDiscount = (item) => {
  const product = getCartProduct(item);
  const subtotal = getLineSubtotal(item);
  const discountPercent = Math.min(Math.max(Number(product.discount || 0), 0), 100);
  return Math.round((subtotal * discountPercent) / 100);
};

export const calculateOrderTotals = (items = []) => {
  const subtotal = items.reduce((sum, item) => sum + getLineSubtotal(item), 0);
  const discount = items.reduce((sum, item) => sum + getLineDiscount(item), 0);
  const discountedSubtotal = Math.max(subtotal - discount, 0);
  const deliveryCharge = discountedSubtotal > 0 && discountedSubtotal < 999 ? 99 : 0;
  const total = discountedSubtotal + deliveryCharge;

  return {
    subtotal,
    discount,
    deliveryCharge,
    total,
  };
};

export const formatPrice = (value = 0) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
