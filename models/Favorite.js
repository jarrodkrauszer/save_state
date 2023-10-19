const { DataTypes, Model } = require('sequelize');
const db = require('../config/connection');


class Favorite extends Model { }

Favorite.init({
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "user",
            key: "id"
        }
    },
    game_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "game",
            key: "id"
        }
    }
},{
    sequelize: db,
    model: 'favorite',
    freezeTableName: true
})

module.exports = Favorite