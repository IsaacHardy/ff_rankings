const express = require('express'),
      passport = require('passport'),
      bodyParser = require('body-parser'),
      expressValidator = require('express-validator'),
      models = require("../models"),
      flash = require('express-flash-messages'),
      User = models.User,
      Ranking = models.Ranking,
      Team = models.Team,
      moment = require("moment"),
      currentWeek = moment().week() - 35,
      router = express.Router();

let ranking = [];
let allTeams = [];

// moment.locale('en', {
//   week : {
//     dow : 2
//   }
// });

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
    week: currentWeek
  })
  .then(function(rank) {
    // TODO: create TEAM.update call to add to weeklyAverage
    req.flash('success', `Successfully created WEEK ${currentWeek} ranking.`)
    res.redirect("/ranks/");
  })
  .catch(function(err) {
    req.flash('error', 'Error creating ranking. Please try again.')
    res.redirect("/ranks/");
  })
});

module.exports = router;
