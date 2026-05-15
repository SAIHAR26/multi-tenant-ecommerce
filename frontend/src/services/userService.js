const userService = {
  getProfile: async () => {
    console.log("Get user profile");
  },

  updateProfile: async (data) => {
    console.log("Update profile", data);
  },
};

export default userService;