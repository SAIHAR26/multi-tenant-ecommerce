const Order = require("../models/Order");
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// SIMPLE RECOMMENDATION LOGIC
const getRecommendations = async (userId) => {
  try {
    // STEP 1: get user orders
    const orders = await Order.find({ userId }).populate("products.productId");

    // STEP 2: get wishlist
    const wishlist = await Wishlist.findOne({ userId });

    let categories = [];

    // STEP 3: extract categories from orders
    orders.forEach(order => {
      order.products.forEach(item => {
        if (item.productId && item.productId.category) {
          categories.push(item.productId.category);
        }
      });
    });

    // STEP 4: wishlist products
    const wishlistProducts = wishlist ? wishlist.savedProducts : [];

    // STEP 5: fetch recommended products
    const recommended = await Product.find({
      $or: [
        { category: { $in: categories } },
        { _id: { $in: wishlistProducts } }
      ]
    }).limit(6);

    return recommended;

  } catch (error) {
    console.log("Recommendation Error:", error);
    return [];
  }
};
module.exports = { getRecommendations };