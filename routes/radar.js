"use strict";

const ObjectID = require('mongodb').ObjectID;

const HAZARDS_COLLECTION = "hazards";

module.exports.post_ongoing_hazard = (req, res) => {
  const db = req.db;

  const type        = +req.body.Type;
  const latitude    = Number(req.body.Geolocation[0].Latitude);
  const longitude   = Number(req.body.Geolocation[0].Longitude);
  const employee_id = req.body.EmployeeID || null;
  const date_today  = new Date();

  if (!type || !(Number.isInteger(type))) {
    res.status(400).send({
      success: false,
      message: "Invalid hazard type"
    });
  }
  else if (!Number(latitude) || !Number(longitude)) {
    res.status(400).send({
      success: false,
      message: "Invalid coordinates"
    });
  }
  else if (!longitude || !latitude) {
    res.status(400).send({
      success: false,
      message: "Invalid geolocation"
    });
  }
  else {
    db.collection(HAZARDS_COLLECTION)
      .insertOne(
        {
          Type         : type,
          Geolocation  : {
            type         : "Point",
            coordinates  : [
              longitude,
              latitude
            ]
          },
          DateCreated  : date_today,
          DateModified : date_today,
          PostedBy     : ObjectID(employee_id),
          isActive     : true
        }
      )
      .then(result => {
        res.status(200).render('radar.html', { result: result.ops[0] })
      })
      .catch(error => {
        res.status(500).send({
          success: false,
          error  : "something went wrong ..."
        })
      });
  }
}


module.exports.deactive_ongoing_hazard  = (req, res) => {
  const db = req.db;

  const hazard_id = req.params.id;

  if (!ObjectID.isValid(hazard_id)) {
    res.status(400).send({
      success: false,
      message: "Invalid hazard id"
    });
  }
  else {
    db.collection(HAZARDS_COLLECTION)
      .updateOne(
        {
          _id : ObjectID(hazard_id),
          isActive: true
        },
        {
          $set: {
            isActive     : false,
            DateModified : new Date()
          }
        }
      )
      .then(result => {
        if (!result.matchedCount) {
          res.status(404).render('radar.html', {
            result: "Hazard is not found or has already been deactivated"
          });
        }
        else {
          res.status(200).render('radar.html', {
            result: "Hazard is deactivated"
          });
        }
      })
      .catch(error => {
        res.status(500).send({
          success: false,
          error: "something went wrong ..."
        });
      });
  }
}


module.exports.get_active_hazards = (req, res) => {
  const db = req.db;

  db.collection(HAZARDS_COLLECTION)
    .aggregate([
      { $match: { isActive: true } },
      { $sort : { DateCreated: -1 } }
    ])
    .toArray()
    .then(hazards => {
      res.status(200).render('radar.html', {
        result: hazards
      });
    })
    .catch(error => {
      res.status(500).send({
        success: false,
        message: error.message
      });
    });

}


module.exports.get_local_hazard = (req, res) => {
  const db = req.db;

  const longitude = Number(req.query.Longitude);
  const latitude  = Number(req.query.Latitude);
  const distance  = Number(req.query.Distance);

  const meter2mile_factor = 0.000621371;

  if (!distance) {
    res.status(400).send({
      success: false,
      message: "Distance not specified"
    })
  }
  else if (!longitude || !latitude) {
    res.status(400).send({
      success: false,
      message: "Wrong longitude / latitude format"
    });
  }
  else {
    db.collection(HAZARDS_COLLECTION)
      .find(
        {
          isActive: true,
          Geolocation: {
            $geoWithin: {
              $centerSphere: [
                [ longitude, latitude ],
                distance * meter2mile_factor  / 3963.2
              ]
            }
          }
        }
      )
      .toArray()
      .then(hazards => {
        res.status(200).send(hazards);
      })
      .catch(error => {
        res.status(500).send({
          success: false,
          error  : error.message
        });
      });
  }

}
