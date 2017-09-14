const express         = require("express"),
      mustacheExpress = require("mustache-express"),
      path            = require("path"),
      morgan          = require("morgan"),
      passport        = require("passport"),
      bcrypt          = require("bcryptjs"),
      User            = require("./models").User,
      LocalStrategy   = require('passport-local').Strategy,
      routes          = require("./routes/index.js"),
      rankings        = require("./routes/rankings.js"),
      moment          = require("moment"),
      teams           = require("./routes/teams.js");

// Initialze Express App
const app = express();

// Set Port
app.set('port', (process.env.PORT || 3000));

// Serve static files to server
app.use(express.static(path.join(__dirname, "public")));

// Setting up View Engine
app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");
app.set("layout", "layout");

app.use(morgan('dev'));

moment.locale('en', {
  week : {
    dow : 2
  }
});

const authenticateUser = function(username, password, done) {
  User.findOne({
    where: {
      'username': username.toLowerCase()
    }
  }).then(function (user) {
    if (user == null) {
      return done(null, false, { message: 'Invalid email and/or password: please try again' })
    }

    let hashedPassword = bcrypt.hashSync(password, user.salt)

    if (user.password === hashedPassword) {
      return done(null, user)
    }

    return done(null, false, { message: 'Invalid email and/or password: please try again' })
  })
}

passport.use(new LocalStrategy(authenticateUser))

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  User.findOne({
    where: {
      'id': id
    }
  }).then(function (user) {
    if (user == null) {
      done(new Error('Wrong user id'))
    }

    done(null, user)
  })
})

// Import Routes
app.use("/", routes);
app.use("/ranks/", rankings);
app.use("/teams/", teams);

app.get("*", function(req, res) {
  req.flash('notify', 'Page not found. Redirected to the login page.')
  res.status(404).redirect("/login/");
});

if (require.main === module) {
  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
}

module.exports = app;
