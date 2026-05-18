const authService = {
  login: async (data) => {
    console.log("Login user", data);
  },

  register: async (data) => {
    console.log("Register user", data);
  },

  logout: () => {
    console.log("Logout user");
  },
};

export default authService;