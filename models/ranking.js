'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ranking = sequelize.define('Ranking', {
    rankingOrder: DataTypes.ARRAY(DataTypes.INTEGER),
    creatorId: DataTypes.INTEGER,
    week: DataTypes.INTEGER
  }, {});

  Ranking.prototype.getRankingOrder = function(Team){
    return Team.findAll({
      where: {
        id: { $in: this.get('rankingOrder') }
      },
      attributes: ['teamName'],
      order: sequelize.literal('(' + this.get('rankingOrder').map(function(id) {
        return '"Team"."id" = \'' + id + '\'';
      }).join(', ') + ') DESC')
    }).then(function(rankingOrder) {

      let ranks = [];

      for (let i = 0; i < rankingOrder.length; i++) {
        let obj = {
          index: i + 1,
          teamName: rankingOrder[i].teamName
        }
        ranks.push(obj);
      }

      return ranks;
    });
  };

  Ranking.associate = function(models) {
    Ranking.belongsTo(models.User, {
      as: "User",
      foreignKey: "creatorId"
    })
  }

  return Ranking;
};
