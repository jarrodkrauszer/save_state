path = require('path')
require('dotenv').config(path.join(__dirname, '../.env'));

const Sequelize = require('sequelize');


const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: '127.0.0.1',
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
      logging: false
    });

module.exports = sequelize;
