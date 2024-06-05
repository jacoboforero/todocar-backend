const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = function (passport) {
  const LocalStrategy = require("passport-local").Strategy;
  const bcrypt = require("bcryptjs");
  const User = require("../models/User"); // Adjust the path as necessary

  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/users/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ googleId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            role: "buyer", // Default role, adjust as needed
          });

          await newUser.save();
          done(null, newUser);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  // Serialize User
  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user); // Debug statement
    process.nextTick(() => {
      done(null, user.id);
    });
  });

  // Deserialize User
  passport.deserializeUser((id, done) => {
    process.nextTick(() => {
      User.findById(id, (err, user) => {
        console.log("Deserializing user:", user); // Debug statement
        done(err, user);
      });
    });
  });
};
