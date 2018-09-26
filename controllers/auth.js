const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/User');

function tokenForUser(user) {
  return jwt.encode({
    iat: new Date().getTime(),
    sub: user._id
   }, config.secret);
}

exports.signin = function (req, res, next) {
  const { user } = req;
  res.json({ user: { ...user._doc, token: tokenForUser(user) } });
};

exports.signup = function(req, res, next) {
  const { email, password } = req.body;

  User.findOne({ email }, function(err, existingUser) {
    let user;

    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ error: 'Email alrady has an account.' });
    }

    user = new User({ email, password });

    user.save(function(err) {
      if (err) {
        return next(err);
      }

      res.json({ token: tokenForUser(user) });
    });
  });
};