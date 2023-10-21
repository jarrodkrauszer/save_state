// const express = require('express');
// const app = express();


const apikey = '667e75de619f4f9480140964a8966690';
const gameNameInput = document.querySelector('#gameTitle');
const searchButton = document.querySelector('#searchButton')


async function getGameByName(gameName) {
    try {
        const response = await fetch(`game/search?title=${gameName}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {    
            const game = data.results[0];
            return game;
        } else {
           
            return null;
        }
    } catch (error) {
       
        console.error('Error fetching game:', error);
        throw error;
    }
}


searchButton.addEventListener('click', async () => {
    const inputValue = gameNameInput.value.trim();
    if (inputValue !== '') {
        try {
            const game = await getGameByName(inputValue);
            if (game) {
                const outputDiv = document.querySelector('#output');
                outputDiv.textContent = `Game Title: ${game.name}, Game image: ${game.background_image} release date ${game.released}`;
            } else {
                const outputDiv = document.querySelector('#output');
                outputDiv.textContent = 'Game not found';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log('Please enter a game title.');
    }
});
