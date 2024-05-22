const express = require("express");
const router = express.Router();
const User = require("../../models/User"); // Adjust the path as necessary

// Registration Route
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    location,
    car,
    primaryOccupation,
    languages,
    role,
    password,
  } = req.body;

  try {
    // Validate input
    const missingFields = [];
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!location) missingFields.push("location");
    if (!languages || languages.length === 0) missingFields.push("languages");
    if (!role) missingFields.push("role");
    if (!password) missingFields.push("password");

    if (role === "seller" && !primaryOccupation) {
      missingFields.push("primaryOccupation");
    }

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ msg: `Please enter all fields: ${missingFields.join(", ")}` });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      location,
      car,
      primaryOccupation: role === "seller" ? primaryOccupation : undefined,
      languages,
      role,
      password,
    });

    // Save user
    await newUser.save();

    // Send response (consider sending a JWT token here if implementing token-based authentication)
    res.status(201).json({
      msg: "User registered successfully",
      user: { id: newUser.id, firstName, lastName, email, role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
