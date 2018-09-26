const passport = require('passport');
const authController = require('./controllers/auth');
const passportService = require('./services/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.post('/signin', requireSignin, authController.signin);
  app.post('/signup', authController.signup);

  // protected routes

  app.get('/', requireAuth, function (req, res) {
    res.json({ hi: 'there' });
  });
}