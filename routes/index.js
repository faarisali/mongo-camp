
const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router()

// ROOT ROUTE
router.get("/", (req, res) => {
    res.render("landing");
});
// AUTH ROUTES
// Sign up ROUTE
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password)
    .then(newUser => {
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    })
    .catch(err => {
        req.flash("error", err.message);
        res.redirect("/register");
    });
});

// Login ROUTE
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

// Logout ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out successfully.")
    res.redirect("/campgrounds");
});

module.exports = router;