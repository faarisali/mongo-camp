const express = require('express');
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware/index');
const router = express.Router()


// INDEX ROUTE
router.get("/", (req, res) => {
    Campground.find({})
     .then((campgrounds) => {
         res.render("campgrounds/index", {campgrounds: campgrounds});
     })
     .catch(() => {
         res.send("something went wrong");
     });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
    const title = req.body.title;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create({
        name: title,
        image: image,
        description: description,
        author: author
    })
    .then((campground) => {
        res.redirect("/campgrounds");
        console.log(campground);
    })
    .catch((err) => {
        req.flash("error", err.message);
    });
})

// SHOW ROUTE
router.get("/:id", (req, res) => {
    const id = req.params.id;
    Campground.findById(id).populate("comments").exec()
    .then(campground => {
        if(campground) {
            res.render("campgrounds/show", {campground: campground});
        } else {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }
    })
    .catch(err => {
        req.flash("error", err.message);
        res.redirect("/");
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    console.log("edit route");

    Campground.findById(req.params.id)
    .then(campground => {
        if(campground) {
            res.render("campgrounds/edit", {campground: campground});
        } else {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
    })
    .catch(err => {
        console.log("something went wrong");
        req.flash("error", err.message);
        res.redirect("/campgrounds");
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    console.log(req.params.id)
    Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    .then(updatedCampground => {
        res.redirect("/campgrounds/" + req.params.id);
    })
    .catch(err => {
        req.flash("error", "Campground couldn't be updated.");
        res.redirect("/");
    });
});

// DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        await campground.remove();
        req.flash("success", "Campground removed.");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/");
    }
});

module.exports = router;