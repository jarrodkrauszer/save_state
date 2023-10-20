const router = require('express').Router();
const Game = require('../models/Game');
const axios = require('axios');

const baseURL = 'https://api.rawg.io/api'



// (https://api.rawg.io/api/games?key=${apikey}&search=${gameName})

router.get('/game/search', async (req, res) => {
  try {
    const games = await axios.get(`${baseURL}/games?key=${process.env.API_KEY}&search=${req.query.title}`);
    
    res.json(games.data);

  } catch (err) {
    console.log(err);
    res.send(err);
    // Set our session errors array to an array of just sequelize error message stings
    // req.session.errors = error.errors.map(err => err.message);
  }
  
});

router.post('/game', (req, res) => {
  const data = req.body;

  if (!data.game_name || !data.genre || !data.release_date)
  {
    return res.status(400).json({
      message: 'All fields must be completed!'
    });
  }

  for (let prop in data) {
    const val = data[prop];
    if (typeof val === 'string') data[prop] = val.trim();
  }

  Game.create(data)
    .then(newGame => {
      res.json(newGame);
    });

});

module.exports = router;