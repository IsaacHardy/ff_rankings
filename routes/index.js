const express = require('express'),
      passport = require('passport'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      expressValidator = require('express-validator'),
      models = require("../models"),
      flash = require('express-flash-messages'),
      User = models.User,
      Ranking = models.Ranking,
      Score = models.Score,
      Team = models.Team,
      moment = require("moment"),
      currentWeek = moment().week() - 35,
      bcrypt = require("bcryptjs"),
      router = express.Router();

let rankings = [];
let weeklyTotal = [];

router.use(bodyParser.urlencoded({
    extended: false
}));

router.use(expressValidator());

router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error', 'You have to be logged in to access the page.')
  res.redirect('/login')
};

router.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

const getRankings = function(req, res, next) {
  Ranking.findAll({
    where: {
      week: currentWeek
    }
  })
    .then(function(data) {
      rankings = data;
      next();
    })
    .catch(function(err) {
      req.flash('error', 'Error retrieving statistics.')
      res.redirect('/login')
    });
};

const generateWeeklyTotal = function(req, res, next) {
  let week = 'week' + currentWeek;
  Score.findAll({
    order: [week],
    include: [{model: Team, as: "Team"}]
  })
  .then(function(scores) {

    scores.forEach(function(score, index) {
      let obj = {
        index: index + 1,
        Team: score.Team
      };
      weeklyTotal.push(obj);
    });
    next();
  })
  .catch(function(err) {
    next();
  });
};

router.get("/admin/", function(req, res) {
  // TODO: Bring in teams/owners and display them on page
  res.render("admin");
});

router.get("/admin/average/:teamId", function(req, res) {
  // TODO: clear weekly-average attribute on all teams
  res.redirect('/admin/')
});

router.get("/admin/user/:userId", function(req, res) {
  // TODO: remove owner from team
  res.redirect('/admin/')
});

router.get("/", isAuthenticated, getRankings, generateWeeklyTotal, function(req, res) {

  res.render("dashboard", {user: req.user, weeklyTotal: weeklyTotal, week: currentWeek});
});

router.get('/login/', function(req, res) {
    res.render("index", {
        messages: res.locals.getMessages()
    });
});

router.post('/login/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login/',
    failureFlash: true
}));

router.get('/logout/', function(req, res) {
    req.logout();
    res.redirect('/login/');
});

router.post('/signup/', function(req, res) {

  let username = req.body.username.toLowerCase(),
      name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1),
      password = req.body.password,
      confirm = req.body.confirm;

  if (!username || !password || !name) {
    req.flash('error', 'Please fill in all the fields')
    res.redirect('/login/')
  } else if (password !== confirm) {
    req.flash('error', 'Passwords to not match.')
    res.redirect('/login/')
  } else {
    let salt = bcrypt.genSaltSync(10)
    let hashedPassword = bcrypt.hashSync(password, salt)

    let newUser = {
      username: username,
      salt: salt,
      password: hashedPassword,
      name: name
    };

    models.User.create(newUser)
      .then(function() {
        req.session.messages = []
        req.flash('success', 'Successfully created new user!')
        res.redirect('/')
      }).catch(function(error) {
        req.flash('error', 'Please choose a different username.')
        res.redirect('/login/')
      })

  }
})

module.exports = router;
