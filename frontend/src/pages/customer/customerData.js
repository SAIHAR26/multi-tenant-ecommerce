export const categoryTabs = [
  "Trending",
  "Fashion",
  "Electronics",
  "Footwear",
  "Accessories",
];

export const priceRanges = [
  {
    label: "Under ₹1000",
    min: 0,
    max: 1000,
  },
  {
    label: "₹1000 - ₹5000",
    min: 1000,
    max: 5000,
  },
  {
    label: "Above ₹5000",
    min: 5000,
    max: 100000,
  },
];

export const products = [
  {
    id: 1,
    name: "Nike Air Max",
    brand: "Nike",
    category: "Footwear",
    price: 4999,
    rating: 4.5,
    discount: 20,
    popularity: 95,
    isTrending: true,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: 2,
    name: "Adidas Hoodie",
    brand: "Adidas",
    category: "Fashion",
    price: 2999,
    rating: 4.2,
    discount: 15,
    popularity: 88,
    isTrending: true,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },
  {
    id: 3,
    name: "Puma Sneakers",
    brand: "Puma",
    category: "Footwear",
    price: 3999,
    rating: 4.0,
    discount: 25,
    popularity: 80,
    isTrending: false,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
  },
  {
    id: 4,
    name: "Zara Jacket",
    brand: "Zara",
    category: "Fashion",
    price: 5999,
    rating: 4.7,
    discount: 30,
    popularity: 92,
    isTrending: true,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  },
];