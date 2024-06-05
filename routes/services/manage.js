//To handle actions like cancelling, rescheduling, or modifying a booked service.
const express = require("express");
const router = express.Router();
const Request = require("../../models/Request");
const { ensureAuthenticated } = require("../../middleware/authentication");

// PUT route to update the status of a booking
router.put("/:requestId", ensureAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.requestId;

    // Validation middleware could be added here
    // e.g., validateStatusUpdate(req, res);

    // Find the booking request
    const request = await Request.findById(requestId);

    // Check if the request exists and if the user has permission to manage it
    if (!request) {
      return res.status(404).json({ msg: "Booking request not found" });
    }

    // Additional authorization checks can be added here
    // e.g., check if req.user.id matches request.user or if the user has admin privileges

    // Update the status of the booking
    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    console.error(error.message);
    // Error handling middleware could be added here
    res.status(500).send("Server Error");
  }
});

module.exports = router;
