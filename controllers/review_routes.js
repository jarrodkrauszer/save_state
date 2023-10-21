const router = require('express').Router();
const Review = require('../models/Review');

router.post('/reviews/:id', async (req, res) => {
  try {
    console.log(req.body);

    await Review.create({ ...req.body, user_id: req.session.user_id, game_id: req.params.id });

    res.redirect(`/reviews/${req.params.id}`);

  } catch (err) {
    console.log(err);

    // req.session.errors = err.errors.map(err => err.message);
    res.redirect('/register');
  }
});

module.exports = router;