const { DataTypes, Model } = require('sequelize');
const db = require('../config/connection');

const { hash, compare } = require('bcrypt');



class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            min: {
                args: 5,
                msg: 'You must enter at least 5 characters'
            },
            max: {
                args: 20,
                msg: 'You can not have that long a name, reel it in.'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                args: true,
                msg: 'That is NOT an email.'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: {
                arg: 6,
                msg: 'Must be longer tahn 6 characters'
            }
        }
    },
    avatar: {
        type: DataTypes.STRING,
    }
},

    {
        modelName: 'user',
        freezeTableName: true,
        sequelize: db,
        hooks: {
            async beforeCreate(user) {
                user.password = await hash(user.password, 10)
                return user;
            }
        }
    })



module.exports = User