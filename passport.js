const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");

// Set up the Passport strategy:
passport.use(
  new LocalStrategy(function (username, password, done) {
    helper.findByUsername(username, async (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      const matchedPassword = await bcrypt.compare(password, user.password);
      
      if (!matchedPassword) {
              return done(null, false);
      }
      console.log(`user found: ${user.username}`);
      return done(null, user);
    });
  })
);

// Serialize a user
passport.serializeUser((user, done) => {
  console.log(`serialize ${user.id}`)
  done(null, user.id);
});
// Deserialize a user
passport.deserializeUser((id, done) => {
  helper.findById(id, (err, user) => {
    console.log('deserialize')
    console.log(user);
    console.log(err);
    if (err) return done(err);
    return done(null, user);
  });
});
