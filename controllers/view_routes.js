const router = require('express').Router();
const axios = require('axios');
const { Op, literal } = require('sequelize');
const { isLoggedIn, isAuthenticated, authenticate } = require('../utils');

const { User, Review, Favorite, Game } = require('../models');

const baseURL = 'https://api.rawg.io/api'


router.get('/', authenticate, async (req, res) => {
  const reviews = await Review.findAll({
    include: [
      {
        model: User,
      },
      {
        model: Game,
        attributes: [
          'id',
          'title',
          [literal("substring(description, 1, 100)"), 'description'], // Limit the description field to the first 50 characters
          'thumbnail'
        ]
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: 8
  });

  res.render('landing', {
    errors: req.session.errors,
    user: req.user,
    reviews: reviews.map(r => r.get({ plain: true })),
  });

});

// Show the register form
router.get('/register', (req, res) => {
  // Render the register form template
  res.render('register_form', {
    errors: req.session.errors,
    user: req.user
  })

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

router.get('/reviews', (req, res) => {
  res.render('reviews', {
    errors: req.session.errors,
    user: req.user,
  });
});

router.get('/reviews/:id', async (req, res) => {
  try {
    console.log(req.user);
    const game = await Game.findByPk(req.params.id);

    const reviews = await Review.findAll({
      where: {
        game_id: req.params.id
      },
      include: [
        {
          model: User,
        },
        {
          model: Game,
          attributes: [
            'title',
            'description',
            'thumbnail',
            'publisher',
            'developer',
            'rating',
            'released_date'
          ]
        }
      ],
    });

    // reviews: reviews.map(r => r.get({ plain: true })),

    res.render('reviews', {
      errors: req.session.errors,
      user: req.user,
      game: game.get({ plain: true }),
      reviews: reviews.map(r => r.get({ plain: true })),
    });

  } catch (err) {
    console.log(err);
    res.send(err);
  }

});

// search one game
router.get('/search', async (req, res) => {
  const gameName = req.query.title;

  try {
    const response = await axios.get(`${baseURL}/games?key=${process.env.API_KEY}&search=${gameName}&search_exact=true`);
    const game = response.data.results[0];

    const newGame = {
      "title": game.name,
      "id": game.id,
      "thumbnail": game.background_image
    }

    console.log(newGame)
    // const reviews = []; need to fetch reviews data from your database or API
    res.render('search', {
      errors: req.session.errors,
      user: req.user,
      results: newGame
    })
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/game', async (req, res) => {
  try {
    // const game = await Game.findByPk(req.query.title);

    const reviews = await Review.findAll({
      where: {
        title: req.query.title
      },
      include: [
        {
          model: User,
        },
        {
          model: Game,
          attributes: [
            'title',
            'description',
            'thumbnail',
            'publisher',
            'developer',
            'rating',
            'released_date'
          ]
        }
      ],
    });

    if (game) {
      res.render('reviews', {
        errors: req.session.errors,
        user: req.user,
        reviews: reviews.map(r => r.get({ plain: true })),
      });
    }
    else {
      

    }
    console.log('Review!', req.query.title);


    res.status(200).json({ message: 'Got games!' });


  } catch (err) {
    console.log(err);
    res.send(err);
  }
})

module.exports = router;