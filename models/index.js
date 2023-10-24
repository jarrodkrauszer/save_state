const Game = require('./Game');
const Review = require('./Review');
const User = require('./User');

Review.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Review, { foreignKey: 'user_id' });


Review.belongsTo(Game, { foreignKey: 'game_id' });
Game.hasMany(Review, { foreignKey: 'game_id' });


module.exports = {
    Game,
    Review,
    User
};