const mongoose = require('mongoose'),
      Campground = require('./models/campground'),
      Comment = require('./models/comment');


const campgrounds = [
    {
        name: 'Dark Forest Draft',
        image: 'https://s3.amazonaws.com/imagescloud/images/medias/camping/camping-tente.jpg',
        description: 'Come and enjoy the darkness and peacefulness of this site.',
        author: { id: '5f4a14e8df4d22444003c157', username: 'faaris' }
    },
    {
        name: 'Lakeview Lounge',
        image: 'https://i.cbc.ca/1.3918633.1589829161!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_940/b-c-camping.jpg',
        description: 'Pristine view of the nature with the lake gives the place a feeling of relaxation and rest.',
        author: { id: '5f4a14e8df4d22444003c157', username: 'faaris' }
    },
    {
        name: 'Whitefloor Camp',
        image: 'https://meccms.imgix.net/wp-content/uploads/2017/02/winter-camping-tent-GettyImages-531210801.jpg?v=1488222550&w=1500&h=599&auto=format&q=30&bg=FFF',
        description: 'Enjoy a different adventure than the ones that you\'re used to!',
        author: { id: '5f4a14e8df4d22444003c157', username: 'faaris' }
    },
    {
        name: 'Rocky Retreat',
        image: 'https://cdn.whistler.com/s3/images/tiles/activities/camping/whistler-insider-camping.jpg',
        description: 'These rocks bring a sense of oneness with nature. Come with a tired heart and leave with a hardened soul.',
        author: { id: '5f4a14e8df4d22444003c157', username: 'faaris' }
    },
    {
        name: 'Saltwater Lake',
        image: 'https://koa.com/blog/images/make-tent-camping-more-comfortable.jpg?preset=blogPhoto',
        description: 'The lake actually isn\'t all that salty!',
        author: { id: '5f4a14e8df4d22444003c157', username: 'faaris' }
    },
    {
        name: 'Greatwhite Site',
        image: 'https://blog-assets.thedyrt.com/uploads/2018/06/freecampingspot-2000x1120.jpg',
        description: 'This site is sure to soothe your mind',
        author: { id: '5f4a14e8df4d22444003c157', username: 'faaris' }
    },
    {
        name: 'Ol\' Plateau',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRvR69CPJAbc_9RiR8aZ_ahHI92VZDWL8fsLg&usqp=CAU',
        description: 'Enjoy your stay on the Ol\' Plateau. Known to be safe and welcoming.',
        author: { id: '5f4a14e8df4d22444003c157', username: 'faaris' }
    }
];

async function seedDB() {
    try {
        await Campground.deleteMany({});
        await Comment.deleteMany({});
    
        for (campground of campgrounds) {
            const campgroundObject = await Campground.create(campground);

            const comment = await Comment.create({
                author: {
                    id: '5f4a1cd21f497926707b8baf',
                    username: 'Howard'
                },
                text: "Really enjoyed it, hope to come back next year!"
            });
    
            campgroundObject.comments.push(comment);
            await campgroundObject.save();
        }

        console.log("Seeded db");
    } catch(err) {
        console.log(err);
    }
}

module.exports = seedDB;