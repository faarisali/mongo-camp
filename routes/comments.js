const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware/index');
const router = express.Router({mergeParams: true});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id)
    .then(campground => {
        res.render("comments/new", {campground: campground});
    })
    .catch(err => {
        req.flash("error", "Campground not found");
        res.render("/campgrounds");
    })
});

// CREATE ROUTE
async function createComment(req, res) {
    // .exec returns a promise whereas normally it would be a mongoose query
    const campground = await Campground.findById(req.params.id).exec();
    const comment = await Comment.create(req.body.comment);
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    await comment.save();
    campground.comments.push(comment);
    await campground.save();
}
router.post("/", middleware.isLoggedIn, (req, res) => {
    createComment(req, res)
    .catch((err) => {
        console.log(err);
        req.flash("error", "Couldn't post comment");
    });
    res.redirect("/campgrounds/" + req.params.id);
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, async(req, res) => {
    const campground = await Campground.findById(req.params.id).exec();
    const comment = await Comment.findById(req.params.comment_id).exec();
    res.render("comments/edit", {
        comment: comment,
        campground: campground
    });
});

// UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id)
    .then(comment => {
        comment.text = req.body.comment.text;
        comment.save();
    })
    .catch(err => {
        console.log(err);
    })
    res.redirect("/campgrounds/" + req.params.id);
})

// DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndRemove(req.params.comment_id)
    .then(removedCampground => {
        req.flash("success", "Removed comment");
    })
    .catch(err => {
        req.flash("error", "Could not remove comment.");
    });
    
    res.redirect("/campgrounds/" + req.params.id);
});

module.exports = router;