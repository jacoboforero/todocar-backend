const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  lastName: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  location: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  car: {
    make: { type: String },
    model: { type: String },
    mileage: { type: Number },
  },
  primaryOccupation: {
    type: String,
    required: function () {
      return this.role === "seller" && !this.googleId;
    },
  },
  languages: {
    type: [String],
    required: function () {
      return !this.googleId;
    },
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
    required: function () {
      return !this.googleId;
    },
  },
  qualifications: {
    type: [String],
    required: function () {
      return this.role === "seller" && !this.googleId;
    },
  },
  googleId: {
    type: String,
    required: false,
  },
});

// Password hashing middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  console.log("Unhashed Password:", this.password);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Hashed Password:", this.password); // Debug statement
  next();
  next();
});

// Password validation helper method
UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
