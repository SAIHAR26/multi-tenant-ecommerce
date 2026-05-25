const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");

const productImages = {
  "Formal Shirt":
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop",
  Sneakers:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
  Hoodie:
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
  Jeans:
    "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop",
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "vshop",
  });

  for (const [name, imageUrl] of Object.entries(productImages)) {
    await Product.updateMany({ name }, { $set: { images: [imageUrl] } });
  }

  const products = await Product.find().select("name images").lean();
  console.log(JSON.stringify(products, null, 2));
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
