const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  car: {
    make: { type: String },
    model: { type: String },
    mileage: { type: Number },
  },
  primaryOccupation: {
    type: String,
    required: function () {
      return this.role === "seller";
    },
  },
  languages: {
    type: [String],
    required: true,
  },
  role: {
    type: String,
    enum: ["buyer", "seller", "both"],
    required: true,
  },
  dateRegistered: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
});

// Password hashing middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password validation helper method
UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
