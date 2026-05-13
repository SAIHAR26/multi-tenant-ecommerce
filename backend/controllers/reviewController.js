const getReviews = (req, res) => {
  res.json({
    message: "Reviews fetched",
  });
};

const addReview = (req, res) => {
  res.json({
    message: "Review added",
  });
};

module.exports = {
  getReviews,
  addReview,
};