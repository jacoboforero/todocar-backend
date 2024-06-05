const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/database");
const errorHandlingMiddleware = require("./middleware/errorHandling");
const cors = require("cors");
const MongoStore = require("connect-mongo");

// Passport Config
require("./config/passport")(passport);

const app = express();

// Connect to Database
connectDB();

//cors middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Use environment variable
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Persistent session store
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production
      httpOnly: true, // Prevents client-side JS from reading the cookie
      sameSite: "lax", // Helps with CSRF protection
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  next();
});

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
  res.status(500).send("Something broke oh no!");
});

app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
