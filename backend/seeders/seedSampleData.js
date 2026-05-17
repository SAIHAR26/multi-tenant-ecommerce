const dotenv = require("dotenv");
const mongoose = require("mongoose");

const User = require("../models/User");
const Store = require("../models/Store");
const Product = require("../models/Product");

dotenv.config();

const vendors = [
  {
    name: "Arjun Rao",
    email: "arjun@urbanvault.com",
    storeName: "Urban Vault",
    storeCategory: "Men",
    location: "Hyderabad",
    description: "Premium menswear, jackets, shirts, and everyday street essentials.",
    products: [
      {
        name: "Matte Utility Jacket",
        description: "Structured utility jacket with premium matte finish.",
        price: 12499,
        stock: 29,
        category: "Men",
        images: [
          "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Olive"],
        rating: 4.8,
      },
      {
        name: "Premium Polo Tee",
        description: "Soft cotton polo tee for daily premium wear.",
        price: 999,
        stock: 82,
        category: "Men",
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        ],
        sizes: ["S", "M", "L"],
        colors: ["Black", "White"],
        rating: 4.1,
      },
    ],
  },
  {
    name: "Meera Shah",
    email: "meera@luxelane.com",
    storeName: "Luxe Lane",
    storeCategory: "Accessories",
    location: "Mumbai",
    description: "Luxury bags, jewelry, and accessories for modern shoppers.",
    products: [
      {
        name: "Noir Leather Tote",
        description: "Elegant leather tote with roomy premium storage.",
        price: 6499,
        stock: 84,
        category: "Accessories",
        images: [
          "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80",
        ],
        colors: ["Black"],
        rating: 4.9,
      },
      {
        name: "Luxury Handbag",
        description: "Designer handbag for evening and daily styling.",
        price: 5299,
        stock: 46,
        category: "Women",
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
        ],
        colors: ["Tan", "Black"],
        rating: 4.8,
      },
    ],
  },
  {
    name: "Kabir Sen",
    email: "kabir@redlinestudio.com",
    storeName: "Redline Studio",
    storeCategory: "Shoes",
    location: "Bengaluru",
    description: "Sneakers, runners, and performance footwear for active customers.",
    products: [
      {
        name: "Crimson Runner",
        description: "Bold red running sneakers with lightweight street comfort.",
        price: 8999,
        stock: 64,
        category: "Shoes",
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
        ],
        sizes: ["7", "8", "9", "10"],
        colors: ["Red"],
        rating: 4.7,
      },
      {
        name: "Running Foam X",
        description: "Responsive foam running shoe for training and casual use.",
        price: 4599,
        stock: 71,
        category: "Shoes",
        images: [
          "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
        ],
        sizes: ["7", "8", "9", "10"],
        colors: ["Black", "White"],
        rating: 4.4,
      },
    ],
  },
  {
    name: "Nisha Kapoor",
    email: "nisha@chromehouse.com",
    storeName: "Chrome House",
    storeCategory: "Accessories",
    location: "Delhi",
    description: "Wallets, sunglasses, belts, and polished everyday accessories.",
    products: [
      {
        name: "Chrome Wallet",
        description: "Compact wallet with modern chrome-style detailing.",
        price: 3299,
        stock: 118,
        category: "Accessories",
        images: [
          "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
        ],
        colors: ["Black", "Silver"],
        rating: 4.6,
      },
      {
        name: "Designer Sunglasses",
        description: "Premium sunglasses with sharp everyday styling.",
        price: 6999,
        stock: 39,
        category: "Accessories",
        images: [
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
        ],
        colors: ["Black"],
        rating: 4.6,
      },
    ],
  },
];

const customers = [
  {
    name: "Aadhya Sharma",
    email: "aadhya.customer@vshop.com",
    phone: "9000000001",
    location: "Hyderabad",
    age: 22,
  },
  {
    name: "Rohan Mehta",
    email: "rohan.customer@vshop.com",
    phone: "9000000002",
    location: "Mumbai",
    age: 26,
  },
  {
    name: "Sneha Reddy",
    email: "sneha.customer@vshop.com",
    phone: "9000000003",
    location: "Bengaluru",
    age: 24,
  },
  {
    name: "Vikram Singh",
    email: "vikram.customer@vshop.com",
    phone: "9000000004",
    location: "Delhi",
    age: 29,
  },
];

const seedSampleData = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "vshop",
  });

  const vendorEmails = vendors.map((vendor) => vendor.email);
  const vendorNames = vendors.map((vendor) => vendor.storeName);
  const customerEmails = customers.map((customer) => customer.email);

  await Product.deleteMany({
    name: { $in: vendors.flatMap((vendor) => vendor.products.map((product) => product.name)) },
  });
  await Store.deleteMany({ storeName: { $in: vendorNames } });
  await User.deleteMany({ email: { $in: vendorEmails } });
  await User.deleteMany({ email: { $in: customerEmails } });

  for (const vendor of vendors) {
    const user = await User.create({
      name: vendor.name,
      email: vendor.email,
      password: "Password123",
      role: "vendor",
      location: vendor.location,
      store: {
        name: vendor.storeName,
        category: vendor.storeCategory,
      },
    });

    const store = await Store.create({
      vendorId: user._id,
      storeName: vendor.storeName,
      storeDescription: vendor.description,
      storeCategory: vendor.storeCategory,
      location: vendor.location,
    });

    await Product.insertMany(
      vendor.products.map((product) => ({
        ...product,
        storeId: store._id,
      }))
    );
  }

  for (const customer of customers) {
    await User.create({
      ...customer,
      password: "Password123",
      role: "customer",
    });
  }

  console.log(
    `Seeded ${vendors.length} vendors, ${customers.length} customers, ${vendors.length} stores, and ${vendors.reduce((total, vendor) => total + vendor.products.length, 0)} products.`
  );
};

seedSampleData()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
