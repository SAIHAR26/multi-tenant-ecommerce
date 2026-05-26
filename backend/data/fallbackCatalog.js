const fallbackProducts = [
  {
    _id: "fallback-formal-shirt",
    name: "Formal Shirt",
    description: "Premium cotton shirt",
    price: 999,
    stock: 20,
    category: "Men",
    brand: "FashionHub",
    discount: 10,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop",
    ],
    sizes: ["M", "L"],
    colors: ["Blue"],
    rating: 4.5,
    isActive: true,
    storeId: {
      _id: "fallback-store-fashionhub",
      storeName: "Fashion Hub",
      storeCategory: "Fashion",
    },
  },
  {
    _id: "fallback-sneakers",
    name: "Sneakers",
    description: "Comfort running shoes",
    price: 1999,
    stock: 15,
    category: "Footwear",
    brand: "UrbanWear",
    discount: 5,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    ],
    sizes: ["8", "9"],
    colors: ["Black"],
    rating: 4,
    isActive: true,
    storeId: {
      _id: "fallback-store-urbanwear",
      storeName: "Urban Wear",
      storeCategory: "Clothing",
    },
  },
  {
    _id: "fallback-hoodie",
    name: "Hoodie",
    description: "Winter cotton hoodie",
    price: 1499,
    stock: 25,
    category: "Winter Wear",
    brand: "FashionHub",
    discount: 15,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    ],
    sizes: ["M", "L", "XL"],
    colors: ["Grey"],
    rating: 5,
    isActive: true,
    storeId: {
      _id: "fallback-store-fashionhub",
      storeName: "Fashion Hub",
      storeCategory: "Fashion",
    },
  },
  {
    _id: "fallback-jeans",
    name: "Jeans",
    description: "Slim fit denim jeans",
    price: 1799,
    stock: 30,
    category: "Clothing",
    brand: "UrbanWear",
    discount: 8,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop",
    ],
    sizes: ["30", "32", "34"],
    colors: ["Blue"],
    rating: 4.2,
    isActive: true,
    storeId: {
      _id: "fallback-store-urbanwear",
      storeName: "Urban Wear",
      storeCategory: "Clothing",
    },
  },
];

const fallbackStores = [
  {
    _id: "fallback-store-fashionhub",
    storeName: "Fashion Hub",
    storeDescription: "Best fashion products",
    storeCategory: "Fashion",
    location: "Hyderabad",
    storeBanner:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    _id: "fallback-store-urbanwear",
    storeName: "Urban Wear",
    storeDescription: "Modern clothing collection",
    storeCategory: "Clothing",
    location: "Bangalore",
    storeBanner:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  },
];

module.exports = {
  fallbackProducts,
  fallbackStores,
};
