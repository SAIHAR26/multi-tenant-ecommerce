const mongoose = require("mongoose");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Review = require("./models/Review");
const Store = require("./models/Store");

mongoose.connect("mongodb://127.0.0.1:27017/vshop")
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log(err);
});

const seedData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Store.deleteMany();

    console.log("Old Data Deleted");

    // VENDORS
    const vendors = await User.insertMany([
      {
        name: "FashionHub",
        email: "fashionhub@gmail.com",
        password: "123456",
        role: "VENDOR",
      },
      {
        name: "UrbanWear",
        email: "urbanwear@gmail.com",
        password: "123456",
        role: "VENDOR",
      },
    ]);

    // CUSTOMERS
    const customers = await User.insertMany([
      {
        name: "Rahul",
        email: "rahul@gmail.com",
        password: "123456",
        role: "CUSTOMER",
      },
      {
        name: "Sneha",
        email: "sneha@gmail.com",
        password: "123456",
        role: "CUSTOMER",
      },
    ]);

    // STORES
    const stores = await Store.insertMany([
      {
        vendorId: vendors[0]._id,
        storeName: "FashionHub Store",
        storeDescription: "Best fashion products",
        storeCategory: "Fashion",
        location: "Hyderabad",
      },
      {
        vendorId: vendors[1]._id,
        storeName: "UrbanWear Store",
        storeDescription: "Modern clothing collections",
        storeCategory: "Clothing",
        location: "Bangalore",
      },
    ]);

    // PRODUCTS (UPDATED FOR STEP 5)
    const products = await Product.insertMany([
      {
        storeId: stores[0]._id,
        vendor: vendors[0]._id,
        name: "Formal Shirt",
        description: "Premium cotton formal shirt",
        price: 999,
        stock: 20,
        category: "Men",
        brand: "FashionHub",
        discount: 10,
        rating: 4.5,
        images: ["shirt.jpg"],
        sizes: ["M", "L", "XL"],
        colors: ["Blue", "White"],
      },
      {
        storeId: stores[1]._id,
        vendor: vendors[1]._id,
        name: "Sneakers",
        description: "Comfortable sneakers",
        price: 1999,
        stock: 15,
        category: "Footwear",
        brand: "UrbanWear",
        discount: 5,
        rating: 4.2,
        images: ["sneakers.jpg"],
        sizes: ["8", "9", "10"],
        colors: ["Black", "White"],
      },
    ]);

    // REVIEWS
    await Review.insertMany([
      {
        userId: customers[0]._id,
        productId: products[0]._id,
        rating: 5,
        comment: "Amazing quality",
      },
      {
        userId: customers[1]._id,
        productId: products[1]._id,
        rating: 4,
        comment: "Fast delivery",
      },
    ]);

    // ORDERS
    await Order.insertMany([
      {
        userId: customers[0]._id,
        products: [products[0]._id],
        totalAmount: 999,
        status: "PROCESSING",
        deliveryAddress: "Hyderabad",
      },
      {
        userId: customers[1]._id,
        products: [products[1]._id],
        totalAmount: 1999,
        status: "SHIPPED",
        deliveryAddress: "Bangalore",
      },
    ]);

    console.log("Sample Data Inserted");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedData();