const express = require('express'),
      passport = require('passport'),
      bodyParser = require('body-parser'),
      expressValidator = require('express-validator'),
      models = require("../models"),
      flash = require('express-flash-messages'),
      User = models.User,
      Ranking = models.Ranking,
      Team = models.Team,
      router = express.Router();

let ranking = [];
let teams = [];

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
  Team.findAll()
    .then(function(teams) {
      teams = teams;
      next();
    });
}

router.get("/", isAuthenticated, getTeams, function(req, res) {
  Ranking.findAll()
    .then(function(rankings) {
      let ranks = [];

      for (let i = 0; i < rankings.length; i++) {
        let rank = rankings[i].getRankingOrder(Team);

        ranks.push(rank);
      }

      console.log(ranks);
      res.render("rankings", {rankings: ranks, teams: teams, messages: res.locals.getMessages()});
    })
    .catch(function(err) {
      console.log(err);
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

router.post("/", isAuthenticated, parseRanks, function(req, res) {
  Ranking.create({
    rankingOrder: ranking,
    creatorId: req.user.id,
    week: 2
  })
  .then(function(rank) {
    console.log(rank);
    res.redirect("/ranks/");
  })
  .catch(function(err) {
    req.flash('error', 'Error creating ranking. Please try again.')
    res.redirect("/ranks/");
  })
});

module.exports = router;
