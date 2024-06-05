const express = require("express");
const router = express.Router();
const Request = require("../../models/Request"); // Importing the Request model
const { ensureAuthenticated } = require("../../middleware/authentication"); // Authentication middleware

// @route   GET /requests
// @desc    Get all requests
// @access  Private
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user.id }).populate(
      "service"
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /requests
// @desc    Create a new service request
// @access  Private
router.post("/", ensureAuthenticated, async (req, res) => {
  const { service, details } = req.body;

  // Simple validation
  if (!service) {
    return res.status(400).json({ message: "Service is required" });
  }

  try {
    const newRequest = new Request({
      user: req.user.id, // Assuming req.user is set by the authentication middleware
      service,
      details,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Additional routes for updating and deleting requests can be added as needed

module.exports = router;
