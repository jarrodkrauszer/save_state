const router = require('express').Router();

const { User, Review, Favorite, Game } = require('../models');


router.get('/', (req, res) => {
    res.render('landing')
})

module.exports = router;