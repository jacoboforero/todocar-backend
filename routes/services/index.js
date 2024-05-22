const express = require("express");
const router = express.Router();

// Importing individual service-related route handlers
const searchServices = require("./search");
const bookService = require("./book");
const manageService = require("./manage");

// Route for searching services
router.use("/search", searchServices);

// Route for booking services
router.use("/book", bookService);

// Route for managing services
router.use("/manage", manageService);

// Export the router
module.exports = router;
