const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Assuming a rating scale of 1-5
    max: 5,
  },
  comment: {
    type: String,
    required: false,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  // You can add additional fields as necessary
});

module.exports = mongoose.model("Review", ReviewSchema);
