const { DataTypes, Model } = require('sequelize');
const db = require('../config/connection');


class Game extends Model { }

Game.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    game_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            min: {
                args: 0,
                msg: 'Please enter a valid title.'
            },

        }
    },
    description: {
        type: DataTypes.TEXT
    },
    thumbnail: {
        type: DataTypes.STRING,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    release_date: {
        type: DataTypes.DATE,
        allowNull: false
    } 
},

    {
        modelName: 'game',
        freezeTableName: true,
        sequelize: db,
    })



module.exports = Game
