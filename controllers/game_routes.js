const router = require('express').Router();
const Game = require('../models/Game');


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