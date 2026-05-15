const reviewService = {
  getReviews: async () => {
    console.log("Fetch reviews");
  },

  addReview: async (data) => {
    console.log("Add review", data);
  },
};

export default reviewService;