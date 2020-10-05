const mongoose = require("mongoose");
const Comment = require("./comment");
const campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// on removing a campground document, removes all the comments in that campground first
campgroundSchema.pre("remove", async function(next) {
    try {
        await Comment.deleteMany({
            _id: {
                $in: this.comments // $in is $include operator and works on all the comment id's in this campground
            }
        });
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);