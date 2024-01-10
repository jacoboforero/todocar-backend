const express = require("express");
const router = express.Router();
const Review = require("../models/Review"); // Importing the Review model
const ensureAuthenticated = require("../middleware/authentication"); // Authentication middleware

// @route   GET /reviews
// @desc    Get all reviews
// @access  Public
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", ["name"])
      .populate("service");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /reviews
// @desc    Create a new review
// @access  Private
router.post("/", ensureAuthenticated, async (req, res) => {
  const { user, service, rating, comment } = req.body;

  // Simple validation
  if (!service || !rating) {
    return res.status(400).json({ message: "Service and rating are required" });
  }

  try {
    const newReview = new Review({
      user: req.user.id, // Assuming req.user is set by the authentication middleware
      service,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Additional routes (PUT, DELETE) can be added here as needed

module.exports = router;
