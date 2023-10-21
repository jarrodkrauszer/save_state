// const express = require('express');
// const app = express();


const apikey = '667e75de619f4f9480140964a8966690';
const gameNameInput = document.querySelector('#gameTitle');
const searchButton = document.querySelector('#searchButton')


async function getGameByName(gameName) {
    try {
      console.log('About to search a game!');
        await fetch(`game?title=${gameName}`);
        console.log(response);
        console.log('About to Fetch reviews!');
        fetch('/reviews');
      
    } catch (error) {
       
        console.error('Error fetching game:', error);
        throw error;
    }
}


searchButton.addEventListener('click', async () => {
    const inputValue = gameNameInput.value.trim();
    if (inputValue !== '') {
        try {
          console.log('Get Name');
            const game = await getGameByName(inputValue);
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log('Please enter a game title.');
    }
});
