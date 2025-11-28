const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails, displayName, photos } = profile;
        const email = emails[0].value;
        const picture = photos[0]?.value;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
          // Create new user
          user = new User({
            email,
            username: displayName,
            googleId: id,
            profilePicture: picture,
            password: Math.random().toString(36).slice(-8),
          });
          await user.save();
        } else if (!user.googleId) {
          // Link Google account
          user.googleId = id;
          user.profilePicture = picture;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
