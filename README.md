# mongo-camp
A web application that allows users to create campsite postings.
You can checkout the site hosted on Heroku at http://mongo-camp.herokuapp.com/
# Installation
You need to make sure you have Node.js installed on the machine you wish to run the code on. You can install Node.js at https://nodejs.org/en/.

You also need to install MongoDB from https://www.mongodb.com/try/download/community. Make sure that you have a DB running at ```mongodb://localhost:27017/yelp_camp```. If your URL is different, change the ```DB_URL_LOCAL``` constant in app.js to the URL you are using.

To setup the node modules used in this project, run ```npm install```.

# Running the project
To get the site working locally, run ```./s``` in the root directory terminal.

# If ```./s``` fails
If it does not work, make sure the node server is running in your terminal and reload your browser.

If it still fails then run ```node app.js``` instead and go to ```localhost:3000``` in your browser.
