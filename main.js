"use strict";
const express    = require("express");
const bodyParser = require("body-parser");
const mongodb    = require("mongodb");
const ObjectID   = mongodb.ObjectID;

/* For letting database turn on first. Then, server will start */
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const dbEmitter = new MyEmitter();

/* For environment variable */
require('dotenv').config()

const app = express();

/*    Middlewares   */
app.use(bodyParser.json());

/*   DB connection  */
const mongodb_uri = process.env.MONGODB_URI;
let db;

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

app.get('/', (req, res) => {
  res.status(200).send({
    hello : "world"
  });
});

app.get('/api/users', (req, res) => {
  const db = req.db;

  db.collection("users")
    .find()
    .toArray()
    .then(result => {
      res.status(200).send({
        result
      })
    })
    .catch(err => {
      res.status(500).send({
        err
      })
    })

});

app.post('/api/users', (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;

  db.collection("users")
    .insertOne({ Name: name, Surname: surname })
    .then(result => {
      res.status(200).send({
        success: true,
        result
      });
    });
});
