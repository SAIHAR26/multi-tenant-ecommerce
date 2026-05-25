export const PRODUCT_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff";

export const getProductImage = (product, fallback = PRODUCT_IMAGE_FALLBACK) =>
  product?.images?.[0] || product?.image || fallback;
