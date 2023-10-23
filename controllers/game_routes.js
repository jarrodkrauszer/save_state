const router = require('express').Router();
const axios = require('axios');
const Game = require('../models/Game');

const baseURL = 'https://api.rawg.io/api';

router.post('/games', async (req, res) => {
  let gamesAdded = 0;
  try {
    let response = '';
    for (x = 0; x < 125; x++) {
      if (x<1) {
        response = await axios.get(`${baseURL}/games?key=${process.env.API_KEY}&search_exact=true`);
      } else {
        response = await axios.get(`${baseURL}/games?key=${process.env.API_KEY}&search_exact=true&page=${++x}`);
      }
      
    
    const game = response.data.results;
    ;
    // console.log(response.data.results);
    if(gamesAdded < 1001) {
      if (game) {
        game.forEach(async game => {
          const detailedResponse = await axios.get(`${baseURL}/games/${game.id}?key=${process.env.API_KEY}`);
          const finalGame = detailedResponse.data;
          if(finalGame.name.length < 1 || finalGame.name === null) {
            console.log('Bad Name: ', finalGame.name)
          }
          console.log(finalGame.name);
          if (finalGame.name.length > 0 && finalGame.released !== null && finalGame.name !== null && finalGame.name !== '911 Operator' && finalGame.name !== '2064: Read Only Memories' && finalGame.name !== '140' && finalGame.name !== '112 Operator') {
            const newGame = await Game.create({
              title: finalGame.name,
              description: finalGame.description_raw,
              thumbnail: finalGame.background_image,
              genre: finalGame.genres.length > 0 ? finalGame.genres[0].name : '',
              released_date: finalGame.released,
              publisher: finalGame.publishers.length > 0 ? finalGame.publishers[0].name : '',
              developer: finalGame.developers.length > 0 ? finalGame.developers[0].name : '',
              rating: finalGame.rating
            });
          }
          gamesAdded++;
        // console.log('Game added to the database:');
        })
        
      } else {
        res.status(404).json({ error: 'Game not found' });
      }
    }
    
    }
    // res.status(201).json({ message: 'Game Table Seeded!'});

  } catch (error) {
    console.error('Error fetching/adding game:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;