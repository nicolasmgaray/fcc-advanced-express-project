'use strict';
const passport = require("passport")
const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const session = require("express-session");
const mongo = require('mongodb').MongoClient;
const auth = require('./auth.js');
const routes = require('./routes.js');
const app = express();

//For FCC testing purposes

fccTesting(app); 

// Middleware Config

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());



mongo.connect(process.env.DB, (err, db) => {
  if(err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successful database connection');

    // Initialize Passport / Auth
    auth(app,db);
    
    // Initialize Routes
    routes(app,db);
    
    // Listen
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });

  }
});




