const User = require("../models/User");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Login failed: User not found");
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (user.password !== password) {
      console.log("Login failed: Incorrect password");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(`Login successful for user: ${username}`);
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(
        `Registration failed: Username "${username}" is already taken`
      );
      return res.status(409).json({ message: "Username is already taken" });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    console.log(`User registered successfully: ${username}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { login, register };
