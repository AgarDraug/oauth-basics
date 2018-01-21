const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
  // options for the strat
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    // check if user exists
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if (currentUser) {
        // alreayd have the user
        console.log('user is: ', currentUser);
        done(null, currentUser);
      } else {
        // if not, create new user
        new User({
          username: profile.displayName,
          googleId: profile.id, 
        }).save().then((newUser) => {
          console.log('new user create: ', newUser);
          done(null, newUser);
        });
      }
    });    
  })
);

