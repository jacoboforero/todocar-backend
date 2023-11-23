const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path as necessary

// Registration Route
router.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Validate input (basic example, expand as needed)
    if (!username || !email || !password || !role) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password,
      role,
    });

    // Save user
    await newUser.save();

    // Send response (consider sending a JWT token here if implementing token-based authentication)
    res
      .status(201)
      .json({
        msg: "User registered successfully",
        user: { id: newUser.id, username, email, role },
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
