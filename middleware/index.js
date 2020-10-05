const Campground = require('../models/campground');
const Comment = require('../models/comment');

middlewareObj = {};


middlewareObj.checkCommentOwnership = async function(req, res, next) {
    const comment = await Comment.findById(req.params.comment_id);
    if (req.isAuthenticated() && comment.author.id.equals(req.user._id)) {
        return next();
    }
    res.redirect("back");
}

middlewareObj.checkCampgroundOwnership = async function (req, res, next) {
    try {
        const campground = await Campground.findById(req.params.id);
        if (req.isAuthenticated()) {
            if(req.user._id.equals(campground.author.id)) {
                return next();
            } else {
                req.flash("error", "You do not own this campground.");
            }
        }
        res.redirect("back");
    } catch(err) {
        req.flash("error", "Campground not found");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be signed in.");
    res.redirect("/login");
}

module.exports = middlewareObj;