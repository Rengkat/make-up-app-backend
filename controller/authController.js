const registerUser = (req, res) => {
  const { firstName, surname, email, password } = req.body;
  res.json({ firstName, surname, email, password });
};
const loginUser = (req, res) => {};
const logoutUser = (req, res) => {};
module.exports = { registerUser, loginUser, logoutUser };
