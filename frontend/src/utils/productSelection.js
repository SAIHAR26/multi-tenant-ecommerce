const getProductGroup = (product) =>
  (product?.category || product?.storeId?.storeCategory || product?.brand || "product")
    .toString()
    .toLowerCase()
    .trim();

export const getDiverseProducts = (products, limit) => {
  const selected = [];
  const usedGroups = new Set();

  products.forEach((product) => {
    if (selected.length >= limit) return;

    const group = getProductGroup(product);
    if (usedGroups.has(group)) return;

    selected.push(product);
    usedGroups.add(group);
  });

  products.forEach((product) => {
    if (selected.length >= limit) return;
    if (selected.includes(product)) return;

    selected.push(product);
  });

  return selected;
};
