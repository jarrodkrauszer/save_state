const router = require('express').Router();
const { isLoggedIn, isAuthenticated, authenticate } = require('../utils');

const { User, Review, Favorite, Game } = require('../models');


router.get('/', authenticate, async (req, res) => {
    // const reviews = await Review.findAll({
    //   include: {
    //     model: User,
    //     as: 'author'
    //   }
    // });
  
    res.render('landing')
    //   user: req.user,
    //   reviews: reviews.map(r => r.get({ plain: true }))
    // });
  });
  
  // Show the register form
  router.get('/register',  (req, res) => {
    // Render the register form template
    res.render('register_form')
  
    console.log('clicked register get route')
    
    req.session.errors = [];
  });
  
  // GET route to show the login form
  router.get('/login', (req, res) => {
    // Render the register form template
    res.render('login_form', {
      errors: req.session.errors,
      user: req.user,
    });
  
    req.session.errors = [];
  });
module.exports = router;