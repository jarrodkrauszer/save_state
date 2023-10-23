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

router.get('/review/:id', async (req, res) => {
  const { data: game } = await axios.get(`${baseURL}/games/${req.params.id}?key=${process.env.API_KEY}`);
  console.log(game)
  res.render('review', {
    errors: req.session.errors,
    user: req.user,
    game,
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

    res.render('review', {
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
router.post('/search', async (req, res) => {
  const gameName = req.body.title;
  console.log(gameName)
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
    console.log(games)
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
    else {


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
    console.log(games);
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
  console.log(req.session.user_id);
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
          [literal("substring(description, 1, 100)"), 'description'], // Limit the description field to the first 50 characters
          'thumbnail'
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

// router.post('/games', async (req, res) => {
//   const gameName = req.query.title;

//   try {

//     const response = await axios.get(`${baseURL}/games?key=${process.env.API_KEY}&search=${gameName}&search_exact=true`);
//     const game = response.data.results[0];

//     if (game) {
//       const detailedResponse = await axios.get(`${baseURL}/games/${game.id}?key=${process.env.API_KEY}`);
//       const finalGame = detailedResponse.data;
//       const newGame = await Game.create({
//         title: finalGame.name,
//         description: finalGame.description,
//         thumbnail: finalGame.background_image,
//         genre: finalGame.genres[0].name,
//         released_date: finalGame.released,
//         publisher: finalGame.publishers[0].name,
//         developer: finalGame.developers[0].name
//       });
//       res.status(201).json(newGame);
//       console.log('Game added to the database:', newGame.toJSON());
//     } else {
//       res.status(404).json({ error: 'Game not found' });
//     }
//   } catch (error) {
//     console.error('Error fetching/adding game:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
module.exports = router;