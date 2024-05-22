const express = require("express");
const passport = require("passport");
const router = express.Router();

// Local Strategy - Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) return res.status(400).json(info);

    req.logIn(user, (err) => {
      if (err) throw err;
      return res.status(200).json({ msg: "Successfully Authenticated", user });
    });
  })(req, res, next);
});

// Google Strategy - Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Strategy - Callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home or to another page.
    res.redirect("/"); // or to some profile/dashboard page
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login"); // redirects to login page after logging out
});

module.exports = router;
