"use strict";
const express       = require("express");
const bodyParser    = require("body-parser");
const mongodb       = require("mongodb");
const ObjectID      = mongodb.ObjectID;
const passport      = require("passport");
const LocalStrategy = require("passport-local");
const session       = require('express-session');
const bcrypt        = require("bcrypt");

/* Exports */
const users   = require('./routes/users');
const reports = require('./routes/safety_cards');

const auth    = require('./routes/auth');

/* For letting database turn on first. Then, server will start */
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const dbEmitter = new MyEmitter();

/* For environment variable */
require('dotenv').config();

const app = express();

/*    Middlewares   */
app.use(bodyParser.json());
app.use('/', express.static(__dirname + "/public"));
app.use(session({
    secret: "XhJOwU2yBkHdYAMNvkA2",
    resave: false,
    saveUninitialized: false,
    cookie: { /*secure: true requires https*/ }
}));
app.use(passport.initialize());
app.use(passport.session());

/*   DB connection  */
const mongodb_uri = process.env.MONGODB_URI;
let db;

/* Passport */
passport.use(new LocalStrategy({
        usernameField: 'Email',
        passwordField: 'Password',
        passReqToCallback: true,
        session: false
    },
    function(req, email, pass, done) {
        db.collection("users").findOne({"Email": email}, function(err,user) {
            if (err) { return done(err); }
            if (!user) { return done(null,false); }
            bcrypt.compare(pass,user.Password,function(err,same) {
                if (err)
                    return done(err);
                
                if (same)
                    return done(null, user);

                return done(null,false);
            });
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

/* Connect to the database before starting the application server */
mongodb.MongoClient.connect(mongodb_uri, (err, database) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

    /* Slap server on a face to wake it up */
    dbEmitter.emit("dbready");
});

/* Use database throughout all routes*/
app.all('*', (req, res, next) => {
    req.db = db;
    next();
});

/* Server wakes up after "dbready" event is emitted from his db-friend Mongo */
dbEmitter.once("dbready", () => {
    const server = app.listen(process.env.PORT || 8080, () => {
        const port = server.address().port;
        console.log("App now running on port", port);
    });
});

/* -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- */

/*   Routes!   */

/* Users */
app.get('/api/users', users.get_users);
app.post('/api/users', users.post_users);

/* Reports */
app.get('/api/reports', reports.get_safetycard_all);
app.get('/api/reports/:id', reports.get_safetycard_one);
app.post('/api/reports', reports.post_safetycard);


app.post('/api/auth/register', auth.register);

app.post('/api/auth/login', 
    passport.authenticate('local', { failureRedirect: '/login.html' }),
    function(req, res) {
        res.redirect('/');
    }
);