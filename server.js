const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/database");

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
    secret: "secret", // Replace 'secret' with a real secret key
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up routes here
// ...

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
