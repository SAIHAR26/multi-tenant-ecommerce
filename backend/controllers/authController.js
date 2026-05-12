const registerUser = (req, res) => {
  res.send("Register User API");
};

const loginUser = (req, res) => {
  res.send("Login User API");
};

module.exports = {
  registerUser,
  loginUser,
};