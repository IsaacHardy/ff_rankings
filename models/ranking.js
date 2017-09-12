'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ranking = sequelize.define('Ranking', {
    rankingOrder: DataTypes.ARRAY(DataTypes.INTEGER),
    creatorId: DataTypes.INTEGER,
    week: DataTypes.INTEGER
  }, {});

  Ranking.associate = function(models) {
    Ranking.belongsTo(models.User, {
      as: "User",
      foreignKey: "creatorId"
    })
  }

  return Ranking;
};
