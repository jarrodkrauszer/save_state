const router = require('express').Router();
const Review = require('../models/Review');

router.post('/review', (req, res) => {
  const data = req.body;

  Review.create(data)
    .then(newReview => {
      res.json(newReview);
    });

});

module.exports = router;