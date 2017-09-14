'use strict';
module.exports = function(sequelize, DataTypes) {
  var Team = sequelize.define('Team', {
    teamName: DataTypes.STRING,
    ownerId: DataTypes.INTEGER
    // TODO: Turn this into object with week key to values
    // weeklyAverage: DataTypes.INTEGER
  }, {});

  Team.associate = function(models) {
    Team.belongsTo(models.User, {
      as: "User",
      foreignKey: "ownerId"
    })
  }

  return Team;
};
