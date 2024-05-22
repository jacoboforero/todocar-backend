// authentication.js

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // If the user is not authenticated, redirects to the login page

  res.redirect("/login");
}

module.exports = ensureAuthenticated;
