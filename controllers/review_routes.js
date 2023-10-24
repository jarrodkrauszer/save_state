const router = require('express').Router();
const Review = require('../models/Review');
const Game = require('../models/Game');
const { isLoggedIn, isAuthenticated, authenticate } = require('../utils');

router.post('/review/:id', isAuthenticated, authenticate, async (req, res) => {
  
  try {
    const game_id = req.params.id;
    console.log(game_id)
    let game = await Game.findByPk(game_id);

    if (!game) {
      game = await Game.create({
        ...req.body,
      });
    }
    console.log(req.body)
    await Review.create({ 
      user_id: req.user.id, 
      game_id: req.params.id,
      review_text: req.body.review_text
    });

    res.redirect(`/review/${req.params.id}`);

  } catch (err) {
    console.log(err);

    // req.session.errors = err.errors.map(err => err.message);
    res.redirect('/register');
  }
});

module.exports = router;