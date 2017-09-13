'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ranking = sequelize.define('Ranking', {
    rankingOrder: DataTypes.ARRAY(DataTypes.INTEGER),
    creatorId: DataTypes.INTEGER,
    week: DataTypes.INTEGER
  }, {});

  Ranking.prototype.getRankingOrder = function(Team){
    Team.findAll({
      where: {
        id: { $in: this.get('rankingOrder') }
      },
      attributes: ['teamName']
    }).then(function(rankingOrder) {
      let ranks = [];

      for (let i = 0; i < rankingOrder.length; i++) {
        ranks.push(rankingOrder[i].teamName);
      }
      return ranks;
    });
  };

  // Ranking.prototype.setRankingOrder = function(ids){
  //   return this.setDataValues('rankingOrder', ids).save().then(self => {
  //     return self;
  //   });
  // };

  Ranking.associate = function(models) {
    Ranking.belongsTo(models.User, {
      as: "User",
      foreignKey: "creatorId"
    })
  }

  return Ranking;
};
