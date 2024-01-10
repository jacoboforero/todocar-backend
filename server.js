const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/database");
const errorHandlingMiddleware = require("./middleware/errorHandling");

// Passport Config
require("./config/passport")(passport);

const app = express();

// Connect to Database
connectDB();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Use environment variable
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const userRoutes = require("./routes/users");
const serviceRoutes = require("./routes/services");
const requestRoutes = require("./routes/requests");
const reviewRoutes = require("./routes/reviews");
// Add other route imports as necessary

// Use routes
app.use("/users", userRoutes);
app.use("/services", serviceRoutes);
app.use("/requests", requestRoutes);
app.use("/reviews", reviewRoutes);
// Add other route uses as necessary

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
