const express = require("express");
const {
  ensureAuthenticated,
  getUser,
} = require("../../middleware/authentication");
const router = express.Router();

// Import the routers from the individual route files
const loginRouter = require("./login");
const registerRouter = require("./register");

// Mount the individual routers on their respective endpoint paths
router.use(loginRouter);
router.use(registerRouter);

// Add this route to get user info
router.get("/me", getUser);

module.exports = router;
