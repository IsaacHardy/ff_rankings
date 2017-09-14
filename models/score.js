'use strict';
module.exports = function(sequelize, DataTypes) {
  var Score = sequelize.define('Score', {
    teamId: DataTypes.INTEGER,
    week1: DataTypes.INTEGER,
    week2: DataTypes.INTEGER,
    week3: DataTypes.INTEGER,
    week4: DataTypes.INTEGER,
    week5: DataTypes.INTEGER,
    week6: DataTypes.INTEGER,
    week7: DataTypes.INTEGER,
    week8: DataTypes.INTEGER,
    week9: DataTypes.INTEGER,
    week10: DataTypes.INTEGER,
    week11: DataTypes.INTEGER,
    week12: DataTypes.INTEGER,
    week13: DataTypes. INTEGER,
    week14: DataTypes.INTEGER,
    week15: DataTypes.INTEGER,
    week16: DataTypes.INTEGER
  }, {});

  Score.associate = function(models) {
      Score.belongsTo(models.Team, {
        as: "Team",
        foreignKey: "teamId"
      })
  };

  return Score;
};
