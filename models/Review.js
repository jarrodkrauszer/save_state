const { DataTypes, Model } = require('sequelize');
const db = require('../config/connection');

const { hash, compare } = require('bcrypt');



class Review extends Model {}

Review.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    review_text: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: {
                args: 0,
                msg: 'You have more opinions than that, be true to yourself'
            },

        }
    },
    rating: {
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    game_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'game',
            key: 'id'
        }
    },

},
    {
        modelName: 'review',
        freezeTableName: true,
        sequelize: db,
    })

    module.exports = Review;
