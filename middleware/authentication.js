// authentication.js

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ msg: "Unauthorized" });
}

function getUser(req, res) {
  console.log("Session data:", req.session);
  console.log("Session ID:", req.sessionID);
  console.log("User in session:", req.session.passport);
  if (req.isAuthenticated()) {
    console.log("Session ID:", req.sessionID);
    console.log("Session:", req.session);
    console.log("User authenticated:", req.user);
    return res.status(200).json({ user: req.user });
  }
  console.log("User not authenticated");
  res.status(401).json({ msg: "Unauthorized" });
}

module.exports = { ensureAuthenticated, getUser };
