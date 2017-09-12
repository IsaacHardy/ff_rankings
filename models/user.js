'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    salt: DataTypes.STRING,
    name: DataTypes.STRING,
    teamClaimed: DataTypes.BOOLEAN
  }, {});

  User.associate = function(models) {
    User.hasMany(models.Ranking, {
      as: "Rankings",
      foreignKey: "creatorId"
    })

    User.hasMany(models.Team, {
      as: "Teams",
      foreignKey: "ownerId"
    })
  }

  return User;
};
