const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Product = require("../models/Product");
const Store = require("../models/Store");

const storeProfiles = [
  {
    name: "Sole Sprint",
    category: "Footwear",
    description: "Performance shoes and everyday sneakers for active shoppers.",
    banner: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Stride Street",
    category: "Footwear",
    description: "Street sneakers, sporty essentials, and casual footwear.",
    banner: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Denim District",
    category: "Fashion",
    description: "Denim, jeans, and durable casual wardrobe staples.",
    banner: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1604176424472-17cd740f74e9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Core Cotton",
    category: "Fashion",
    description: "Soft tees, everyday basics, and relaxed casualwear.",
    banner: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Shirt Studio",
    category: "Fashion",
    description: "Smart shirts and polished essentials for daily styling.",
    banner: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Formal House",
    category: "Fashion",
    description: "Office-ready formalwear and refined menswear pieces.",
    banner: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Trail Pack Co",
    category: "Bags",
    description: "Backpacks, travel bags, and practical carry essentials.",
    banner: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Audio Orbit",
    category: "Electronics",
    description: "Wireless audio, earbuds, and compact tech accessories.",
    banner: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Wrist Lab",
    category: "Electronics",
    description: "Smart watches and wearable accessories for connected days.",
    banner: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Lens Luxe",
    category: "Accessories",
    description: "Sunglasses, frames, and premium eyewear accessories.",
    banner: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=400&q=80",
  },
];

const productRules = [
  {
    test: /nike|shoe/i,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    test: /adidas|sneaker/i,
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
  },
  {
    test: /levi|jeans|denim/i,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80",
  },
  {
    test: /puma|t-shirt|tee/i,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    test: /roadster|shirt/i,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
  },
  {
    test: /allen solly|formal/i,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80",
  },
  {
    test: /wildcraft|bag/i,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
  {
    test: /samsung|buds|earbud/i,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
  },
  {
    test: /apple|watch/i,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=900&q=80",
  },
  {
    test: /rayban|glasses|sunglasses/i,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
  },
];

const fallbackProductImage =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80";

const getRuleForProduct = (name) =>
  productRules.find((rule) => rule.test.test(name)) || {
    category: "Marketplace",
    image: fallbackProductImage,
  };

const getStoreNumber = (storeName) => {
  const match = String(storeName || "").match(/^Store\s+(\d+)$/i);
  return match ? Number(match[1]) : null;
};

const run = async () => {
  await connectDB();

  const stores = await Store.find().sort({ createdAt: 1 });
  const storeNameById = new Map();

  for (let index = 0; index < stores.length; index += 1) {
    const store = stores[index];
    const storeNumber = getStoreNumber(store.storeName);
    const profile = storeProfiles[(storeNumber || index + 1) - 1] || storeProfiles[index % storeProfiles.length];

    await Store.findByIdAndUpdate(store._id, {
      storeName: profile.name,
      storeCategory: profile.category,
      storeDescription: profile.description,
      storeBanner: profile.banner,
      storeLogo: profile.logo,
    });

    storeNameById.set(store._id.toString(), profile.name);
  }

  const products = await Product.find().select("name storeId");

  for (const product of products) {
    const rule = getRuleForProduct(product.name);
    const storeName = product.storeId ? storeNameById.get(product.storeId.toString()) : null;

    await Product.findByIdAndUpdate(product._id, {
      category: rule.category,
      images: [rule.image],
      brand: storeName || product.name.replace(/\s+\d+$/, ""),
    });
  }

  const updatedProducts = await Product.find()
    .select("name category brand images storeId")
    .populate("storeId", "storeName storeCategory")
    .lean();
  const updatedStores = await Store.find().select("storeName storeCategory storeBanner storeLogo").lean();

  console.log(
    JSON.stringify(
      {
        productsUpdated: updatedProducts.length,
        storesUpdated: updatedStores.length,
        sampleProducts: updatedProducts.slice(0, 10).map((product) => ({
          name: product.name,
          category: product.category,
          brand: product.brand,
          image: product.images?.[0],
          store: product.storeId?.storeName,
        })),
        stores: updatedStores.map((store) => ({
          name: store.storeName,
          category: store.storeCategory,
          banner: store.storeBanner,
        })),
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
