const express = require("express");
const router = express.Router();
const Service = require("../../models/Service");
const { ensureAuthenticated } = require("../../middleware/authentication");

// Implement full-text search on 'name' and 'description' fields
Service.createIndexes({ name: "text", description: "text" });

// GET route for searching services with full-text search
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const {
      searchTerm,
      category,
      price,
      availability,
      page = 1,
      limit = 10,
    } = req.query;
    let query = {};

    if (searchTerm) {
      query.$text = { $search: searchTerm };
    }
    if (category) {
      query.category = category;
    }
    if (price) {
      query.price = price;
    }
    if (availability !== undefined) {
      query.availability = availability === "true";
    }

    const services = await Service.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(services);
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
});

module.exports = router;
