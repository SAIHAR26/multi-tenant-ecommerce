const Product = require("../models/Product");

// GET RECOMMENDED PRODUCTS
const getRecommendations = async (req, res) => {
  try {
    const recommendedProducts = await Product.find()
      .limit(6);

    res.status(200).json({
      success: true,
      count: recommendedProducts.length,
      data: recommendedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getRecommendations,
};