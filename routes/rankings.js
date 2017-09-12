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

router.get("/", isAuthenticated, function(req, res) {
  Ranking.findAll()
    .then(function(rankings) {
      console.log("RANKINGS: ", rankings);
      res.render("rankings", {rankings: rankings, messages: res.locals.getMessages()})
      // Team.findAll({
      //
      // })
      //   .then(function(teams) {
      //     res.render("rankings", {rankings: rankings, teams: teams});
      //   })
      //   .catch(function(err) {
      //     req.flash('error', 'Error retrieving rankings. Please try again.')
      //     res.render("rankings");
      //   })
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

router.post("/", isAuthenticated, parseRanks, function(req, res) {
  Ranking.create({
    rankingOrder: ranking,
    creatorId: req.user.id,
    week: 2
  })
  .then(function(rank) {
    res.redirect("/ranks/");
  })
  .catch(function(err) {
    req.flash('error', 'Error creating ranking. Please try again.')
    res.redirect("/ranks/");
  })
});

module.exports = router;
