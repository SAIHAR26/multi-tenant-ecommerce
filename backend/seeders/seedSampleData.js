const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const User = require("../models/User");
const Store = require("../models/Store");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

dotenv.config();

const adminUser = {
  name: "V Shop Admin",
  email: "admin@vshop.com",
  password: "Admin@12345",
  role: "admin",
  isApproved: true,
  approvalStatus: "approved",
};

const vendors = [
  {
    name: "Arjun Rao",
    email: "arjun@urbanvault.com",
    storeName: "Urban Vault",
    storeCategory: "Men",
    location: "Hyderabad",
    description: "Premium menswear, jackets, shirts, and everyday street essentials.",
    banner:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    logo:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80",
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
    banner:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    logo:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
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
    banner:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    logo:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=400&q=80",
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
    banner:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    logo:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80",
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
  {
    name: "Isha Menon",
    email: "isha@aurorasilks.com",
    storeName: "Aurora Silks",
    storeCategory: "Women",
    location: "Chennai",
    description: "Elegant sarees, festive dresses, and premium ethnic silhouettes.",
    banner:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
    logo:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Ivory Silk Saree",
        description: "Soft silk saree with a polished festive finish.",
        price: 11499,
        stock: 32,
        category: "Women",
        images: [
          "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=80",
        ],
        colors: ["Ivory", "Gold"],
        rating: 4.9,
      },
      {
        name: "Rose Festive Kurta",
        description: "Premium kurta with detailed embroidery and modern fit.",
        price: 3899,
        stock: 54,
        category: "Women",
        images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Rose", "Cream"],
        rating: 4.7,
      },
    ],
  },
  {
    name: "Dev Malhotra",
    email: "dev@technoir.com",
    storeName: "Tech Noir",
    storeCategory: "Electronics",
    location: "Pune",
    description: "Smart gadgets, audio gear, and clean everyday tech.",
    banner:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    logo:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Noir Wireless Headphones",
        description: "Noise-isolating wireless headphones with premium tuning.",
        price: 7999,
        stock: 67,
        category: "Electronics",
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        ],
        colors: ["Black"],
        rating: 4.6,
      },
      {
        name: "Smart Desk Speaker",
        description: "Compact speaker with rich sound for work and home.",
        price: 4499,
        stock: 73,
        category: "Electronics",
        images: [
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80",
        ],
        colors: ["Graphite"],
        rating: 4.5,
      },
    ],
  },
  {
    name: "Tara Gill",
    email: "tara@littleloom.com",
    storeName: "Little Loom",
    storeCategory: "Kids",
    location: "Kochi",
    description: "Soft kidswear, playful basics, and cheerful daily outfits.",
    banner:
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1200&q=80",
    logo:
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Cloud Cotton Dungaree",
        description: "Soft cotton dungaree made for playful everyday comfort.",
        price: 1899,
        stock: 91,
        category: "Kids",
        images: [
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80",
        ],
        sizes: ["2Y", "4Y", "6Y"],
        colors: ["Sky", "Cream"],
        rating: 4.8,
      },
      {
        name: "Sunny Kids Sneakers",
        description: "Lightweight kids sneakers with flexible everyday grip.",
        price: 2499,
        stock: 58,
        category: "Kids",
        images: [
          "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80",
        ],
        sizes: ["10C", "11C", "12C"],
        colors: ["Yellow", "White"],
        rating: 4.4,
      },
    ],
  },
  {
    name: "Omar Qureshi",
    email: "omar@pageandpine.com",
    storeName: "Page & Pine",
    storeCategory: "Books",
    location: "Jaipur",
    description: "Curated books, journals, and refined desk essentials.",
    banner:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    logo:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Design Thinking Library",
        description: "A premium boxed set for product and design readers.",
        price: 2999,
        stock: 44,
        category: "Books",
        images: [
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
        ],
        colors: ["Mixed"],
        rating: 4.7,
      },
      {
        name: "Leather Bound Journal",
        description: "Minimal journal with smooth paper and durable binding.",
        price: 1199,
        stock: 120,
        category: "Books",
        images: [
          "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",
        ],
        colors: ["Brown", "Black"],
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

const legacySampleData = {
  productNames: ["Formal Shirt", "Sneakers", "Hoodie", "Jeans"],
  storeNames: ["Fashion Hub", "Urban Wear"],
  userEmails: ["fashionhub@gmail.com", "urbanwear@gmail.com"],
};

const seedSampleData = async () => {
  await connectDB();

  const vendorEmails = vendors.map((vendor) => vendor.email);
  const vendorNames = vendors.map((vendor) => vendor.storeName);
  const customerEmails = customers.map((customer) => customer.email);
  const productNames = vendors.flatMap((vendor) => vendor.products.map((product) => product.name));

  await Product.deleteMany({
    $or: [
      { name: { $in: [...productNames, ...legacySampleData.productNames] } },
      { brand: { $in: [...vendorNames, "FashionHub", "UrbanWear"] } },
    ],
  });
  await Store.deleteMany({ storeName: { $in: [...vendorNames, ...legacySampleData.storeNames] } });
  await User.deleteMany({ email: { $in: [adminUser.email, ...vendorEmails, ...legacySampleData.userEmails] } });
  await User.deleteMany({ email: { $in: customerEmails } });
  await Notification.deleteMany({
    $or: [
      { targetRole: { $in: ["admin", "vendor", "customer", "all"] } },
      { title: { $regex: "V SHOP|vendor|order|payment|review|customer", $options: "i" } },
    ],
  });

  const admin = await User.create(adminUser);
  const vendorUsers = [];
  const customerUsers = [];
  const createdProducts = [];

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
      isApproved: true,
      approvalStatus: "approved",
    });
    vendorUsers.push(user);

    const store = await Store.create({
      vendorId: user._id,
      storeName: vendor.storeName,
      storeDescription: vendor.description,
      storeCategory: vendor.storeCategory,
      location: vendor.location,
      storeLogo: vendor.logo,
      storeBanner: vendor.banner,
    });

    const insertedProducts = await Product.insertMany(
      vendor.products.map((product) => ({
        ...product,
        storeId: store._id,
        vendor: user._id,
        brand: vendor.storeName,
      }))
    );
    createdProducts.push(...insertedProducts);
  }

  for (const customer of customers) {
    const customerUser = await User.create({
      ...customer,
      password: "Password123",
      role: "customer",
    });
    customerUsers.push(customerUser);
  }

  await Notification.insertMany([
    {
      title: "New vendor waiting for review",
      message: "A vendor profile needs admin verification before marketplace promotion.",
      preview: "Vendor approval request is ready.",
      sender: "Vendor Desk",
      type: "vendor",
      targetRole: "admin",
      userId: admin._id,
    },
    {
      title: "Marketplace revenue increased",
      message: "Today revenue is trending above the previous sample period.",
      preview: "Revenue trend moved upward.",
      sender: "Analytics Engine",
      type: "payment",
      targetRole: "admin",
      userId: admin._id,
    },
    {
      title: "Low rating review alert",
      message: "A product review needs moderation because the rating is below the quality threshold.",
      preview: "Review moderation needed.",
      sender: "Review Monitor",
      type: "review",
      targetRole: "admin",
      userId: admin._id,
      isRead: true,
    },
    {
      title: "Customer segment updated",
      message: "Premium repeat buyers segment has refreshed with the latest customer activity.",
      preview: "Segment refresh completed.",
      sender: "Customer Insights",
      type: "customer",
      targetRole: "admin",
      userId: admin._id,
    },
    {
      title: "New order received in your store",
      message: "A customer placed a new order. Prepare packaging and update shipment status.",
      preview: "New store order received.",
      sender: "Order Desk",
      type: "order",
      targetRole: "vendor",
      userId: vendorUsers[0]?._id,
    },
    {
      title: "Product stock is running low",
      message: "One of your products is close to the low-stock threshold. Restock soon.",
      preview: "Inventory attention needed.",
      sender: "Store Inventory",
      type: "vendor",
      targetRole: "vendor",
      userId: vendorUsers[1]?._id,
    },
    {
      title: "New product review",
      message: "A customer added a new review to your product. Reply to keep engagement strong.",
      preview: "Customer review received.",
      sender: "Review Desk",
      type: "review",
      targetRole: "vendor",
      userId: vendorUsers[2]?._id,
    },
    {
      title: "Vendor payout processed",
      message: "Your latest payout has been processed for completed paid orders.",
      preview: "Payout processed successfully.",
      sender: "Payments Team",
      type: "payment",
      targetRole: "vendor",
      userId: vendorUsers[3]?._id,
      isRead: true,
    },
    {
      title: "Your order has been shipped",
      message: "Your V SHOP order is on the way. Track it from your orders page.",
      preview: "Order shipped.",
      sender: "V SHOP Orders",
      type: "order",
      targetRole: "customer",
      userId: customerUsers[0]?._id,
    },
    {
      title: "Payment completed successfully",
      message: "Your payment was confirmed and the order is being processed.",
      preview: "Payment confirmed.",
      sender: "V SHOP Payments",
      type: "payment",
      targetRole: "customer",
      userId: customerUsers[1]?._id,
    },
    {
      title: "Wishlist item is back in stock",
      message: `${createdProducts[0]?.name || "A saved product"} is available again in the marketplace.`,
      preview: "Saved product is available.",
      sender: "Wishlist Updates",
      type: "customer",
      targetRole: "customer",
      userId: customerUsers[2]?._id,
    },
    {
      title: "Recommended products refreshed",
      message: "New premium products have been added based on your recent activity.",
      preview: "Fresh recommendations are ready.",
      sender: "V SHOP Curator",
      type: "system",
      targetRole: "customer",
      userId: customerUsers[3]?._id,
      isRead: true,
    },
  ]);

  console.log(
    `Seeded 1 admin, ${vendors.length} vendors, ${customers.length} customers, ${vendors.length} stores, ${vendors.reduce((total, vendor) => total + vendor.products.length, 0)} products, and 12 role-based notifications.`
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
