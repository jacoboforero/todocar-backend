//To manage booking of services. Include routes to book a service, view booked services, etc.
const express = require("express");
const router = express.Router();
const Request = require("../../models/Request");
const Service = require("../../models/Service");
const { ensureAuthenticated } = require("../../middleware/authentication");

// POST route to create a new booking
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { serviceId, details } = req.body;

    // Validate that the service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ msg: "Service not found" });
    }

    // Create a new booking request
    const newRequest = new Request({
      user: req.user.id, // Assuming req.user is set by authentication middleware
      service: serviceId,
      details: details,
      // Other fields like status are set to default values
    });

    const request = await newRequest.save();

    res.json(request);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
