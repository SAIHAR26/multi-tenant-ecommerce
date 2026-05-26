const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Cart = require("./models/Cart");
const Notification = require("./models/Notification");
const Order = require("./models/Order");
const Payment = require("./models/Payment");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Store = require("./models/Store");
const User = require("./models/User");
const Wishlist = require("./models/Wishlist");
const connectDB = require("./config/db");

dotenv.config();

const demoPassword = "123456";

const adminUser = {
  name: "V Shop Admin",
  email: "admin@vshop.com",
  password: "Admin@12345",
  role: "admin",
  isApproved: true,
  approvalStatus: "approved",
};

const customers = [
  { name: "Customer 1", email: "customer1@gmail.com", phone: "9000000001", location: "Hyderabad", age: 22 },
  { name: "Customer 2", email: "customer2@gmail.com", phone: "9000000002", location: "Mumbai", age: 26 },
  { name: "Customer 3", email: "customer3@gmail.com", phone: "9000000003", location: "Bengaluru", age: 24 },
  { name: "Customer 4", email: "customer4@gmail.com", phone: "9000000004", location: "Delhi", age: 29 },
];

const vendors = [
  {
    owner: "Arjun Rao",
    email: "vendor1@gmail.com",
    storeName: "Sole Sprint",
    storeCategory: "Footwear",
    location: "Hyderabad",
    description: "Performance shoes and everyday sneakers for active shoppers.",
    banner: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Nike Shoes",
        description: "Lightweight everyday shoes with cushioned support.",
        price: 4999,
        stock: 45,
        category: "Footwear",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"],
        sizes: ["7", "8", "9", "10"],
        colors: ["Red", "White"],
        rating: 4.8,
        discount: 12,
      },
      {
        name: "Adidas Sneakers",
        description: "Street-ready sneakers for casual daily wear.",
        price: 4299,
        stock: 38,
        category: "Footwear",
        images: ["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80"],
        sizes: ["7", "8", "9", "10"],
        colors: ["Black", "White"],
        rating: 4.6,
        discount: 10,
      },
    ],
  },
  {
    owner: "Meera Shah",
    email: "vendor2@gmail.com",
    storeName: "Denim District",
    storeCategory: "Fashion",
    location: "Mumbai",
    description: "Denim, shirts, and polished wardrobe staples.",
    banner: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1604176424472-17cd740f74e9?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Levi Jeans",
        description: "Slim fit denim jeans with durable stretch fabric.",
        price: 2799,
        stock: 52,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80"],
        sizes: ["30", "32", "34", "36"],
        colors: ["Blue"],
        rating: 4.5,
        discount: 8,
      },
      {
        name: "Roadster Shirt",
        description: "Smart casual shirt for office and weekend styling.",
        price: 1499,
        stock: 61,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "White"],
        rating: 4.4,
        discount: 15,
      },
    ],
  },
  {
    owner: "Kabir Sen",
    email: "vendor3@gmail.com",
    storeName: "Core Cotton",
    storeCategory: "Fashion",
    location: "Bengaluru",
    description: "Soft tees, hoodies, and everyday basics.",
    banner: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Puma T-Shirt",
        description: "Breathable cotton t-shirt with a clean athletic fit.",
        price: 999,
        stock: 80,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White"],
        rating: 4.3,
        discount: 20,
      },
      {
        name: "Winter Hoodie",
        description: "Soft fleece hoodie for winter comfort.",
        price: 1899,
        stock: 42,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80"],
        sizes: ["M", "L", "XL"],
        colors: ["Grey", "Black"],
        rating: 4.7,
        discount: 18,
      },
    ],
  },
  {
    owner: "Nisha Kapoor",
    email: "vendor4@gmail.com",
    storeName: "Formal House",
    storeCategory: "Fashion",
    location: "Delhi",
    description: "Office-ready formalwear and refined menswear.",
    banner: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Allen Solly Formal",
        description: "Premium formal shirt with a crisp structured finish.",
        price: 2299,
        stock: 35,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Navy"],
        rating: 4.6,
        discount: 10,
      },
      {
        name: "Matte Utility Jacket",
        description: "Structured utility jacket with premium matte finish.",
        price: 6499,
        stock: 29,
        category: "Fashion",
        images: ["https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Olive"],
        rating: 4.8,
        discount: 7,
      },
    ],
  },
  {
    owner: "Isha Menon",
    email: "vendor5@gmail.com",
    storeName: "Trail Pack Co",
    storeCategory: "Bags",
    location: "Chennai",
    description: "Backpacks, travel bags, and practical carry essentials.",
    banner: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Wildcraft Bag",
        description: "Durable backpack with spacious daily storage.",
        price: 3299,
        stock: 44,
        category: "Bags",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80"],
        colors: ["Black", "Olive"],
        rating: 4.7,
        discount: 12,
      },
      {
        name: "Noir Leather Tote",
        description: "Elegant leather tote with roomy premium storage.",
        price: 6499,
        stock: 30,
        category: "Bags",
        images: ["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80"],
        colors: ["Black"],
        rating: 4.9,
        discount: 9,
      },
    ],
  },
  {
    owner: "Dev Malhotra",
    email: "vendor6@gmail.com",
    storeName: "Audio Orbit",
    storeCategory: "Electronics",
    location: "Pune",
    description: "Wireless audio, earbuds, and compact tech accessories.",
    banner: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Samsung Buds",
        description: "Compact wireless earbuds with clear balanced sound.",
        price: 5999,
        stock: 55,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80"],
        colors: ["Black", "White"],
        rating: 4.5,
        discount: 14,
      },
      {
        name: "Noir Wireless Headphones",
        description: "Noise-isolating wireless headphones with premium tuning.",
        price: 7999,
        stock: 36,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"],
        colors: ["Black"],
        rating: 4.6,
        discount: 11,
      },
    ],
  },
  {
    owner: "Tara Gill",
    email: "vendor7@gmail.com",
    storeName: "Wrist Lab",
    storeCategory: "Electronics",
    location: "Kochi",
    description: "Smart watches and wearable accessories for connected days.",
    banner: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Apple Watch",
        description: "Smart wearable for fitness, calls, and daily tracking.",
        price: 28999,
        stock: 23,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80"],
        colors: ["Black", "Silver"],
        rating: 4.9,
        discount: 6,
      },
      {
        name: "Smart Desk Speaker",
        description: "Compact speaker with rich sound for work and home.",
        price: 4499,
        stock: 48,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80"],
        colors: ["Graphite"],
        rating: 4.5,
        discount: 10,
      },
    ],
  },
  {
    owner: "Omar Qureshi",
    email: "vendor8@gmail.com",
    storeName: "Lens Luxe",
    storeCategory: "Accessories",
    location: "Jaipur",
    description: "Sunglasses, frames, and premium eyewear accessories.",
    banner: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "RayBan Glasses",
        description: "Premium sunglasses with sharp everyday styling.",
        price: 6999,
        stock: 28,
        category: "Accessories",
        images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80"],
        colors: ["Black"],
        rating: 4.6,
        discount: 13,
      },
      {
        name: "Chrome Wallet",
        description: "Compact wallet with modern chrome-style detailing.",
        price: 3299,
        stock: 70,
        category: "Accessories",
        images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80"],
        colors: ["Black", "Silver"],
        rating: 4.6,
        discount: 16,
      },
    ],
  },
];

const extraVendors = [
  {
    owner: "Aadhya Sharma",
    email: "vendor9@gmail.com",
    storeName: "Aurora Wardrobe",
    storeCategory: "Women",
    location: "Chennai",
    description: "Elegant womenswear, festive styles, and polished everyday outfits.",
    banner: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Luxury Handbag",
        description: "Designer handbag for evening and daily styling.",
        price: 5299,
        stock: 46,
        category: "Women",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80"],
        colors: ["Tan", "Black"],
        rating: 4.8,
        discount: 18,
      },
      {
        name: "Satin Wrap Top",
        description: "Soft satin wrap top with a refined silhouette.",
        price: 1599,
        stock: 64,
        category: "Women",
        images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L"],
        colors: ["Rose", "Ivory"],
        rating: 4.2,
        discount: 22,
      },
      {
        name: "Embroidered Kurta Set",
        description: "Premium kurta set with detailed embroidery.",
        price: 3299,
        stock: 54,
        category: "Women",
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Rose", "Cream"],
        rating: 4.6,
        discount: 28,
      },
      {
        name: "Ribbed Lounge Set",
        description: "Comfortable matching lounge set for elevated daily wear.",
        price: 3799,
        stock: 40,
        category: "Women",
        images: ["https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L"],
        colors: ["Taupe", "Black"],
        rating: 4.5,
        discount: 20,
      },
    ],
  },
  {
    owner: "Riya Kapoor",
    email: "vendor10@gmail.com",
    storeName: "Velvet Dresses",
    storeCategory: "Dresses",
    location: "Mumbai",
    description: "Statement dresses for parties, events, and premium occasions.",
    banner: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Emerald Satin Dress",
        description: "A fluid satin dress with a graceful evening drape.",
        price: 3899,
        stock: 32,
        category: "Dresses",
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L"],
        colors: ["Emerald"],
        rating: 4.7,
        discount: 22,
      },
      {
        name: "Ivory Floral Midi Dress",
        description: "Light floral midi dress with soft movement.",
        price: 2499,
        stock: 45,
        category: "Dresses",
        images: ["https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Ivory"],
        rating: 4.5,
        discount: 30,
      },
      {
        name: "Black Evening Gown",
        description: "Elegant black gown for formal occasions.",
        price: 5999,
        stock: 24,
        category: "Dresses",
        images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L"],
        colors: ["Black"],
        rating: 4.9,
        discount: 16,
      },
      {
        name: "Rose Wrap Dress",
        description: "Flattering wrap dress with a modern rose tone.",
        price: 3199,
        stock: 37,
        category: "Dresses",
        images: ["https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80"],
        sizes: ["S", "M", "L"],
        colors: ["Rose"],
        rating: 4.6,
        discount: 25,
      },
    ],
  },
  {
    owner: "Tara Gill",
    email: "vendor11@gmail.com",
    storeName: "Little Loom",
    storeCategory: "Kids",
    location: "Kochi",
    description: "Soft kidswear, playful basics, and cheerful daily outfits.",
    banner: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Kids Denim Co-ord",
        description: "Soft denim co-ord set for everyday play.",
        price: 1499,
        stock: 60,
        category: "Kids",
        images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80"],
        sizes: ["2Y", "4Y", "6Y"],
        colors: ["Blue"],
        rating: 4.2,
        discount: 20,
      },
      {
        name: "Junior Graphic Tee Pack",
        description: "Three-pack of soft graphic tees for kids.",
        price: 699,
        stock: 90,
        category: "Kids",
        images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"],
        sizes: ["2Y", "4Y", "6Y", "8Y"],
        colors: ["Mixed"],
        rating: 4.1,
        discount: 25,
      },
      {
        name: "Kids Party Dress",
        description: "Cheerful party dress with soft lining.",
        price: 1899,
        stock: 38,
        category: "Kids",
        images: ["https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=900&q=80"],
        sizes: ["2Y", "4Y", "6Y"],
        colors: ["Pink", "Cream"],
        rating: 4.6,
        discount: 20,
      },
      {
        name: "Kids Learning Tablet",
        description: "Kid-friendly learning tablet for games and practice.",
        price: 4999,
        stock: 31,
        category: "Kids",
        images: ["https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=900&q=80"],
        colors: ["Blue"],
        rating: 4.5,
        discount: 15,
      },
    ],
  },
  {
    owner: "Omar Qureshi",
    email: "vendor12@gmail.com",
    storeName: "Page & Pine",
    storeCategory: "Books",
    location: "Jaipur",
    description: "Curated books, journals, and refined desk essentials.",
    banner: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    products: [
      {
        name: "Mystery Thriller Box",
        description: "A boxed set of page-turning mystery fiction.",
        price: 1299,
        stock: 48,
        category: "Books",
        images: ["https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80"],
        colors: ["Mixed"],
        rating: 4.6,
        discount: 25,
      },
      {
        name: "Design Thinking Handbook",
        description: "Practical product and design thinking guide.",
        price: 1599,
        stock: 42,
        category: "Books",
        images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80"],
        colors: ["Mixed"],
        rating: 4.5,
        discount: 20,
      },
      {
        name: "Children's Story Collection",
        description: "Illustrated story collection for young readers.",
        price: 599,
        stock: 75,
        category: "Books",
        images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80"],
        colors: ["Mixed"],
        rating: 4.4,
        discount: 35,
      },
      {
        name: "Finance Bestseller Bundle",
        description: "Curated finance books for smart money habits.",
        price: 999,
        stock: 54,
        category: "Books",
        images: ["https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80"],
        colors: ["Mixed"],
        rating: 4.2,
        discount: 45,
      },
    ],
  },
];

vendors[0].storeCategory = "Shoes";
vendors[0].products.forEach((product) => {
  product.category = "Shoes";
});
vendors[0].products.push(
  {
    name: "White Court Sneakers",
    description: "Clean court sneakers with a soft cushioned sole.",
    price: 6499,
    stock: 34,
    category: "Shoes",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80"],
    sizes: ["7", "8", "9", "10"],
    colors: ["White"],
    rating: 4.6,
    discount: 20,
  },
  {
    name: "Running Foam X",
    description: "Responsive running shoes for training and casual wear.",
    price: 4599,
    stock: 41,
    category: "Shoes",
    images: ["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80"],
    sizes: ["7", "8", "9", "10"],
    colors: ["Black", "White"],
    rating: 4.4,
    discount: 35,
  }
);

[vendors[1], vendors[2], vendors[3]].forEach((vendor) => {
  vendor.storeCategory = "Men";
  vendor.products.forEach((product) => {
    product.category = "Men";
  });
});

vendors[4].storeCategory = "Accessories";
vendors[4].products.forEach((product) => {
  product.category = "Accessories";
});

vendors.push(...extraVendors);

const clearDatabase = () =>
  Promise.all([
    Cart.deleteMany(),
    Notification.deleteMany(),
    Order.deleteMany(),
    Payment.deleteMany(),
    Product.deleteMany(),
    Review.deleteMany(),
    Store.deleteMany(),
    User.deleteMany(),
    Wishlist.deleteMany(),
  ]);

const getOrderAmounts = (items) => {
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discountAmount = items.reduce(
    (total, item) => total + Math.round((item.product.price * item.quantity * Number(item.product.discount || 0)) / 100),
    0
  );
  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
  const deliveryCharge = discountedSubtotal > 0 && discountedSubtotal < 999 ? 99 : 0;

  return {
    subtotal,
    discountAmount,
    deliveryCharge,
    totalAmount: discountedSubtotal + deliveryCharge,
  };
};

const createOrderWithPayment = async ({ customer, items, status, paymentStatus, paymentMethod, address }) => {
  const amounts = getOrderAmounts(items);
  const order = await Order.create({
    userId: customer._id,
    products: items.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    })),
    ...amounts,
    status,
    paymentStatus,
    paymentMethod,
    deliveryAddress: address,
  });

  await Payment.create({
    orderId: order._id,
    method: paymentMethod === "UPI" ? "NETBANKING" : paymentMethod,
    status: paymentStatus === "PAID" ? "SUCCESS" : "PENDING",
    transactionId: paymentStatus === "PAID" ? `TXN${order._id.toString().slice(-6).toUpperCase()}` : "",
    amount: order.totalAmount,
  });

  return order;
};

const seedDatabase = async ({ shouldConnect = true, shouldDisconnect = true } = {}) => {
  if (shouldConnect) {
    await connectDB();
  }

  await clearDatabase();

  const admin = await User.create(adminUser);
  const customerUsers = [];
  const vendorUsers = [];
  const storeDocs = [];
  const productDocs = [];

  for (const customer of customers) {
    customerUsers.push(
      await User.create({
        ...customer,
        password: demoPassword,
        role: "customer",
        isApproved: true,
        approvalStatus: "approved",
      })
    );
  }

  for (const vendor of vendors) {
    const vendorUser = await User.create({
      name: vendor.owner,
      email: vendor.email,
      password: demoPassword,
      role: "vendor",
      phone: "9888888888",
      location: vendor.location,
      isApproved: true,
      approvalStatus: "approved",
      store: {
        name: vendor.storeName,
        category: vendor.storeCategory,
        bankDetails: "Demo Bank - 000123456789",
      },
    });
    vendorUsers.push(vendorUser);

    const store = await Store.create({
      vendorId: vendorUser._id,
      storeName: vendor.storeName,
      storeDescription: vendor.description,
      storeCategory: vendor.storeCategory,
      location: vendor.location,
      storeLogo: vendor.logo,
      storeBanner: vendor.banner,
      totalRevenue: 50000 + storeDocs.length * 4500,
      totalOrders: 80 + storeDocs.length * 12,
      averageRating: storeDocs.length % 2 === 0 ? 4.5 : 4.8,
      growthPercentage: 10 + storeDocs.length,
    });
    storeDocs.push(store);

    vendorUser.store.storeId = store._id;
    await vendorUser.save();

    for (const product of vendor.products) {
      productDocs.push(
        await Product.create({
          ...product,
          storeId: store._id,
          vendor: vendorUser._id,
          brand: vendor.storeName,
          status: "Live",
          isActive: true,
          lowStockThreshold: 5,
        })
      );
    }
  }

  await Cart.insertMany([
    {
      userId: customerUsers[0]._id,
      items: [
        { productId: productDocs[0]._id, quantity: 1 },
        { productId: productDocs[4]._id, quantity: 2 },
      ],
    },
    {
      userId: customerUsers[1]._id,
      items: [{ productId: productDocs[2]._id, quantity: 1 }],
    },
  ]);

  await Wishlist.insertMany([
    {
      userId: customerUsers[0]._id,
      savedProducts: [productDocs[1]._id, productDocs[14]._id],
    },
    {
      userId: customerUsers[2]._id,
      savedProducts: [productDocs[6]._id, productDocs[10]._id],
    },
  ]);

  await Review.insertMany(
    productDocs.map((product, index) => ({
      userId: customerUsers[index % customerUsers.length]._id,
      productId: product._id,
      rating: index % 3 === 0 ? 5 : 4,
      comment:
        index % 3 === 0
          ? "Excellent quality and fast delivery."
          : "Good product, matches the photos and feels worth the price.",
    }))
  );

  await createOrderWithPayment({
    customer: customerUsers[0],
    items: [{ product: productDocs[0], quantity: 1 }],
    status: "PROCESSING",
    paymentStatus: "PENDING",
    paymentMethod: "COD",
    address: "Hyderabad",
  });
  await createOrderWithPayment({
    customer: customerUsers[1],
    items: [{ product: productDocs[2], quantity: 2 }],
    status: "DELIVERED",
    paymentStatus: "PAID",
    paymentMethod: "CARD",
    address: "Mumbai",
  });
  await createOrderWithPayment({
    customer: customerUsers[2],
    items: [
      { product: productDocs[10], quantity: 1 },
      { product: productDocs[12], quantity: 1 },
    ],
    status: "SHIPPED",
    paymentStatus: "PAID",
    paymentMethod: "NETBANKING",
    address: "Bengaluru",
  });

  await Notification.insertMany([
    {
      title: "New vendor waiting for review",
      message: "A vendor profile needs admin verification before marketplace promotion.",
      type: "vendor",
      targetRole: "admin",
      userId: admin._id,
      sender: "Vendor Desk",
      preview: "Vendor approval request is ready.",
    },
    {
      title: "Your order has been shipped",
      message: "Your V SHOP order is on the way. Track it from your orders page.",
      type: "order",
      targetRole: "customer",
      userId: customerUsers[2]._id,
      sender: "V SHOP Orders",
      preview: "Order shipped.",
    },
    {
      title: "New order received in your store",
      message: "A customer placed a new order. Prepare packaging and update shipment status.",
      type: "order",
      targetRole: "vendor",
      userId: vendorUsers[0]._id,
      sender: "Order Desk",
      preview: "New store order received.",
    },
    {
      title: "Product stock is running low",
      message: "One of your products is close to the low-stock threshold. Restock soon.",
      type: "vendor",
      targetRole: "vendor",
      userId: vendorUsers[1]._id,
      sender: "Store Inventory",
      preview: "Inventory attention needed.",
    },
    {
      title: "Payment completed successfully",
      message: "Your payment was confirmed and the order is being processed.",
      type: "payment",
      targetRole: "customer",
      userId: customerUsers[1]._id,
      sender: "V SHOP Payments",
      preview: "Payment confirmed.",
      isRead: true,
    },
  ]);

  const summary = {
    admins: 1,
    vendors: vendorUsers.length,
    customers: customerUsers.length,
    stores: storeDocs.length,
    products: productDocs.length,
  };

  console.log(
    `Seeded ${summary.admins} admin, ${summary.vendors} vendors, ${summary.customers} customers, ${summary.stores} stores, and ${summary.products} products.`
  );
  console.log("Demo logins:");
  console.log("Admin: admin@vshop.com / Admin@12345 / admin");
  console.log("Customer: customer1@gmail.com / 123456 / customer");
  console.log("Vendor: vendor1@gmail.com / 123456 / vendor");

  if (shouldDisconnect) {
    await mongoose.disconnect();
  }

  return summary;
};

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(async (error) => {
      console.error("Seed failed:", error.message);
      await mongoose.disconnect();
      process.exit(1);
    });
}
