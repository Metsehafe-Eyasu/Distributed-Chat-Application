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

    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, {
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

const user_by_username = async (req, res) => {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
  
    try {
      const user = await User.findOne({ username }, { _id: 1 });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.json({ id: user._id.toString() });
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

module.exports = { login, register, user_by_username };
