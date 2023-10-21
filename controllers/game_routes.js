const router = require('express').Router();
const Game = require('../models/Game');
const axios = require('axios');

const baseURL = 'https://api.rawg.io/api'




router.get('/game/search', async (req, res) => {
  try {
    const { data } = await axios.get(`${baseURL}/games?key=${process.env.API_KEY}&search=${req.query.title}&search_exact=true`);
    
    let game;
    let games;

    res.redirect('/reviews')
    if (data.results.length > 1) {
      console.log('you have more than 1 result');
      games = data.results;
    } else if (data.results.length === 1) {
      console.log('1 result returned');
      game = data.results[0];
      res.redirect('/reviews')
    } else {
      console.log('No results found');

    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
})

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