const express = require('express'),
      passport = require('passport'),
      bodyParser = require('body-parser'),
      expressValidator = require('express-validator'),
      models = require("../models"),
      flash = require('express-flash-messages'),
      User = models.User,
      Team = models.Team,
      router = express.Router();

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
  Team.findAll({
    include: {
      model: User,
      as: "User"
    }
  })
    .then(function(data) {
      res.render("teams", {teams: data, user: req.user, messages: res.locals.getMessages()});
    })
    .catch(function(err) {
      req.flash('error', 'Error loading teams. Please refresh the page.')
      res.render("teams", {messages: res.locals.getMessages()});
    });
});

router.get("/:teamId/", isAuthenticated, function(req, res) {
  if (req.user.teamClaimed) {
    req.flash('error', 'You cannot claim more than one team.')
    res.redirect("/teams/");
  } else {
    Team.update({
      ownerId: req.user.id
    }, {
      where: {
        id: req.params.teamId
      }
    })
    .then(function(team) {
      User.update({
        teamClaimed: true
      }, {
        where: {
          id: req.user.id
        }
      })
      .then(function(user) {
        res.redirect("/teams/");
      })
      .catch(function(err) {
        req.flash('error', 'Error marking claimed on owner.')
        res.redirect("/teams/");
      })
      res.redirect("/teams/");
    })
    .catch(function(err) {
      req.flash('error', 'Error updating team owner.')
      res.redirect("/teams/");
    });
  }
});

module.exports = router;
