const express = require("express");
const passport = require("passport");
const router = express.Router();

// Local Strategy - Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      console.log("No user found:", info);
      return res.status(400).json(info);
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      console.log("User successfully authenticated:", user);
      console.log("Session ID after login:", req.sessionID);
      console.log("Session after login:", req.session);
      return res.status(200).json({ msg: "Successfully Authenticated", user });
    });
  })(req, res, next);
});

// Google Strategy - Redirect to Google
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Strategy - Callback from Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/"); // or to some profile/dashboard page
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
