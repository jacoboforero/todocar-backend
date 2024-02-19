const express = require("express");
const router = express.Router();

// Import the routers from the individual route files
const loginRouter = require("./login");
const registerRouter = require("./register");

// Mount the individual routers on their respective endpoint paths
// Assuming the endpoints in login.js and register.js are already prefixed with '/login' and '/register'
router.use(loginRouter);
router.use(registerRouter);

// If your login and register routers handle more specific paths like '/users/login' and '/users/register',
// and you want to keep this structure, you can explicitly set the paths when mounting the routers:
// router.use("/login", loginRouter);
// router.use("/register", registerRouter);

// Export the consolidated router
module.exports = router;
