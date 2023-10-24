const User = require('../models/User OLD');

// Block an auth page if user is already logged in
function isLoggedIn(req, res, next) {
  if (req.session.user_id) {
    return res.redirect('/');
  }

  next();
}

// Block a route if a user is not logged in
function isAuthenticated(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }

  next();
}

// Attach user data to the request if they are logged in
async function authenticate(req, res, next) {
  const user_id = req.session.user_id;

  if (user_id) {
    const user = await User.findByPk(req.session.user_id);

    req.user = user.get({ plain: true });
  }

  next();
}

module.exports = { isLoggedIn, isAuthenticated, authenticate }