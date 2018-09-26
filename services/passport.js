const passport = require('passport');
const LocalStrategy = require("passport-local");
const JwtStrategy = require('passport-jwt').Strategy;
const JwtExtract = require("passport-jwt").ExtractJwt;
const User = require('../models/User');
const config = require('../config');

const localOptions = {
  usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, function(email, passsword, done) {
  User.findOne({ email }, function(err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false);
    }

    // check if user.password matches given password
    user.comparePassword(passsword, function(err, isMatched) {
      if (err) {
        return done(err);
      }

      if (!isMatched) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
});

const jwtOptions = {
  jwtFromRequest: JwtExtract.fromHeader('authorization'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      return done(null, user);
    }

    done(null, false);
  });
});

passport.use(jwtLogin);
passport.use(localLogin);