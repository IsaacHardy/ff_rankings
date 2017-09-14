const express = require('express'),
      passport = require('passport'),
      bodyParser = require('body-parser'),
      expressValidator = require('express-validator'),
      models = require("../models"),
      flash = require('express-flash-messages'),
      User = models.User,
      Ranking = models.Ranking,
      Team = models.Team,
      Score = models.Score,
      moment = require("moment"),
      currentWeek = moment().week() - 35,
      router = express.Router();

let ranking = [];
let allTeams = [];

router.use(bodyParser.urlencoded({
  extended: false
}));

router.use(expressValidator());

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error', 'You have to be logged in to access the page.')
  res.redirect('/login')
};

const getTeams = function(req, res, next) {
  Team.findAll({
    order: ['teamName'],
  })
    .then(function(teams) {
      allTeams = teams;
      next();
    });
}

router.get("/", isAuthenticated, getTeams, function(req, res) {
  Ranking.findAll({
    where: {
      week: currentWeek
    },
    include: {
      model: User,
      as: "User"
    }
  })
    .then(function(rankings) {
      let ranks = [];
      if (rankings.length) {
        for (let i = 0; i < rankings.length; i++) {
          rankings[i].getRankingOrder(Team).then(function(data) {
            let obj = {
              id: rankings[i].id,
              creator: rankings[i].User.name,
              week: rankings[i].week,
              rankingOrder: data,
              timeCreated: moment(rankings[i].createdAt).fromNow()

            };

            ranks.push(obj);
            if (i === rankings.length - 1) {
              res.render("rankings", {week: currentWeek, rankingList: ranks, teams: allTeams, messages: res.locals.getMessages()});
            }
          });
        }
      } else {
        res.render("rankings", {week:currentWeek, rankingList: [], teams: allTeams, messages: res.locals.getMessages()})
      }
    })
    .catch(function(err) {
      req.flash('error', 'Error retrieving rankings. Please try again.')
      res.render("rankings", {messages: res.locals.getMessages()});
    });
});

const parseRanks = function(req, res, next) {
  ranking = [];

  for (let i = 0; i < 14; i++) {
    let key = new String(i + 1);
    ranking.push(Number(req.body[key]));
  }

  let sortedRankings = ranking.slice().sort();

  for (let i = 0; i < sortedRankings.length - 1; i++) {
    if(sortedRankings[i + 1] === sortedRankings[i]) {
      req.flash('error', 'You had duplicate teams in your rankings. Please try again.')
      return res.redirect("/ranks/");
    }
  }

  next();
};

const checkDupeRanks = function(req, res, next) {
  Ranking.find({
    where: {
      week: currentWeek,
      creatorId: req.user.id
    }
  })
  .then(function(dupedRanking) {
    if (dupedRanking) {
      req.flash('error', `You cannot submit more than one ranking per week.`)
      return res.redirect("/ranks/")
    }
    next();
  })
  .catch(function(err) {
    req.flash('error', `Error checking previous rankings. Contact Isaac.`)
    res.redirect("/ranks/")
  });
};

router.post("/", isAuthenticated, parseRanks, checkDupeRanks, function(req, res) {
  let weekKey = "week" + currentWeek;

  Ranking.create({
    rankingOrder: ranking,
    creatorId: req.user.id,
    week: currentWeek
  })
  .then(function(rank) {
      for (let i = 0; i < ranking.length; i++) {
        Score.find({
          where: {
            teamId: ranking[i]
          }
        })
        .then(function(score) {
          let obj = {
            [weekKey]: score[weekKey] + i
          };
          Score.update(obj, {
            where: {
              teamId: ranking[i]
            }
          })
          .then(function(data) {

          })
          .catch(function(err) {
            req.flash('error', `Error saving ranking data. Please contact Isaac.`)
          });
        })
        .catch(function(err) {
          req.flash('error', `Error finding Score for team. Please contact Isaac.`)
        });
    }
    req.flash('success', `Successfully created WEEK ${currentWeek} ranking.`)
    res.redirect('/ranks/')
  })
  .catch(function(err) {
    req.flash('error', 'Error creating ranking. Please try again.')
    res.redirect("/ranks/");
  });
});

module.exports = router;
