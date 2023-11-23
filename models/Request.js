const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "cancelled"],
    default: "pending",
  },
  details: {
    type: String,
    required: false, // Set to true if details are mandatory
  },
  dateRequested: {
    type: Date,
    default: Date.now,
  },
  // Add other fields as necessary, such as location, preferred time, etc.
  // ...
});

module.exports = mongoose.model("Request", RequestSchema);
