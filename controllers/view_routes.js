const router = require('express').Router();
const axios = require('axios');
const { Op, literal, } = require('sequelize');
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
          'thumbnail',
          'rating'
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

router.get('/review/:id', isAuthenticated, authenticate, async (req, res) => {
  try{
    const { data: game } = await axios.get(`${baseURL}/games/${req.params.id}?key=${process.env.API_KEY}`);
    // console.log(game)
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
            'publishers',
            'developers',
            'rating',
            'released_date'

          ]
        }
      ],
      order: [['createdAt', 'DESC']],
    });

  res.render('review', {
    errors: req.session.errors,
    user: req.user,
    game,
    reviews: reviews.map(r => r.get({ plain: true })),
    helpers: {
      getValues(arr) {
        if (Array.isArray(arr) && arr.length > 0) {
          return arr.reduce((result, obj) => result += obj.name + ' ', '').trim();
        }
        return '';
      }
    }
  });
} catch (err) {
  console.log(err);
  res.send(err);

}
});

// search one game
router.post('/search',authenticate, async (req, res) => {
  const gameName = req.body.title;
  
  try {
    const response = await axios.get(`${baseURL}/games?key=${process.env.API_KEY}&search=${gameName}&search_precise=true`);
    const games = response.data.results;
    // const games = await Game.findAll({
    //   where: {
    //     title: {
    //       [Op.like]: "%" + gameName + "%"
    //     }
    //   }
    // })
  
    // const reviews = []; need to fetch reviews data from your database or API
    res.render('search', {
      errors: req.session.errors,
      user: req.user,
      games
      // games: games.map(gObj => gObj.get({plain: true}))
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

    res.status(200).json({ message: 'Got games!' });


  } catch (err) {
    console.log(err);
    res.send(err);
  }
})

router.get('/newly_released', async (req, res) => {
  try {
    const games = await Game.findAll({
      include: [
        {
          model: Review,
        }
      ],
      order: [['released_date', 'DESC']],
      limit: 8
    });

    res.render('newly_released', {
      errors: req.session.errors,
      user: req.user,
      games: games.map(g => g.get({ plain: true }))
    });

  } catch (err) {
    console.log(err);
    res.send(err);
  }

});

router.get('/top_rated', async (req, res) => {
  try {
    const games = await Game.findAll({
      include: [
        {
          model: Review,
        }
      ],
      order: [['rating', 'DESC']],
      limit: 8
    });
    
    res.render('newly_released', {
      errors: req.session.errors,
      user: req.user,
      games: games.map(g => g.get({ plain: true }))
    });

  } catch (err) {
    console.log(err);
    res.send(err);
  }

});

router.get('/profile', authenticate, async (req, res) => {

    const reviews = await Review.findAll({
      where: {
        user_id: req.session.user_id
      },
      include: [
        {
          model: User,
        },
        {
          model: Game,
          attributes: [
            'id',
            'title',
            [literal("substring(description, 1, 150)"), 'description'], // Limit the description field to the first 50 characters
            'thumbnail',
            'rating'
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 8
  });

  

  res.render('profile', {
    errors: req.session.errors,
    user: req.user,
    reviews: reviews.map(r => r.get({ plain: true })),
  });

});

router.get('/all', authenticate, async (req, res) => {
  
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
          'thumbnail',
          'rating'
        ]
      }
    ],
    order: [['createdAt', 'DESC']],
  });

  res.render('landing', {
    errors: req.session.errors,
    user: req.user,
    reviews: reviews.map(r => r.get({ plain: true })),
  });

});



module.exports = router;