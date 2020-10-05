// when a campground is submitted and the image url is a simple string (i.e. href="fff") of characters, this bug occurs (not program breaking)
// the image href makes a get request to /campgrounds/fff which counts as a get request to /campgrounds/:id
// this causes the db to look up an object with id fff however nothing will come back and an error will be printed to console
const PORT = 3000,
      DB_URL_LOCAL = "mongodb://localhost:27017/yelp_camp",
      DB_URL_PRODUCTION = "FILL THIS WITH THE DATABASE SERVER URL",
      SERV_START_MSG = `Serving YelpCamp on port ${PORT}`,
      DB_NAME = "yelp_camp",
      DB_CONNECT_MSG = `Successful connection to db ${DB_NAME}`,
      DB_FAIL_MSG = `Could not connect to database`

const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      flash = require('connect-flash'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      expressSession = require('express-session'),
      mongoose = require('mongoose'),
      methodOverride = require('method-override');

const Campground = require('./models/campground'),
      Comment = require('./models/comment'),
      User = require('./models/user');
      seedDB = require("./seed");

const indexRoutes = require('./routes/index');
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');

mongoose.connect(DB_URL_LOCAL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log(DB_CONNECT_MSG))
.catch((err) => console.log(DB_FAIL_MSG, err));

// seedDB();

app.set("view engine", "ejs");

// method override ?_method=HTTPVERB
app.use(methodOverride('_method'))

// flash messages config
app.use(flash());

// PASSPORT CONFIG
app.use(expressSession({
    secret: "yelpcamp hello reeee",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}))

// middleware, let ejs files access the logged in user, if there is one, with the variable currentUser
// req.user comes from passport when a user logs in (passport.authenticate)
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// add success and string messages to ejs files -- used in ./views/partials/header.ejs
app.use((req, res, next) => {
    res.locals.sccMsg = req.flash("success");
    res.locals.errMsg = req.flash("error");
    next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, () => {
    console.log(SERV_START_MSG);
});