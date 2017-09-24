"use strict";
const ObjectID = require('mongodb').ObjectID;

module.exports.get_safetycard_all = (request, response) => {
  const db = request.db;

  db.collection("reports")
    .find(
      {
        isDeleted: false,
      },
      {
        _id: 0,
        isDeleted: 0
      }
    )
    .toArray()
    .then(reports => {
      console.log(reports);
      response.status(200).send(reports);
    })
    .catch(error => {
      response.status(500).send({
        success: false,
        error  : err.message
      })
    })

}

module.exports.get_safetycard_one = (request, response) => {
  const db = request.db;
  const card_id = request.params.id;

  if (ObjectID.isValid(card_id)) {
    db.collection("reports")
      .findOne(
        {
          _id : ObjectID(card_id),
          isDeleted: false
        },
        {
          _id : 0,
          isDeleted: 0
        }
      )
      .then(card => {
        response.status(200).send(card);
      })
      .catch(error => {
        response.status(500).send({
          success: false,
          error  : error.message
        })
      })
  }
  else {
    response.status(400).send({
      success: false,
      message: "Report id Invalid"
    });
  }
}


const is_valid_safetycard = (array) => {
  if (!array) {
    return false;
  }
  else if (!Array.isArray(array)) {
    return false;
  }
  else if (typeof array[0] === 'undefined' || array[0] === null) {
    return false;
  }
  else {
    return true;
  }
}


module.exports.post_safetycard = (request, response) => {
    const db = request.db

    const employee_id = request.body.EmployeeID;
    const date_today = new Date();
    const job_name = request.body.JobName;
    const job_description = request.body.JobDescription;
    const dangers = request.body.Dangers;
    const geolocation = request.body.Geolocation;
    const latitude    = Number(geolocation.Latitude);
    const longitude   = Number(geolocation.Longitude);

    if (!ObjectID.isValid(employee_id)) {
      console.log(employee_id);
      response.status(400).send({
        success: false,
        message: "Invalid EmployeeID"
      });
    }
    else if (!job_name || !(typeof job_name === "string")) {
      response.status(400).send({
        success: false,
        message: "Invalid job name"
      });
    }
    else if (!job_description || !(typeof job_description === "string")) {
      response.status(400).send({
        success: false,
        message: "Invalid job description"
      });
    }
    else if (!is_valid_safetycard(dangers)) {
      response.status(400).send({
        success: false,
        message: "Invalid safety card"
      });
    }
    else if (!geolocation.Longitude || !geolocation.Latitude) {
      response.status(400).send({
        success: false,
        message: "Invalid geolocation"
      });
    }
    else {
      // find user first -> if exists - ok, if not - error
      db.collection("users")
        .findOne(
          {
            _id : ObjectID(employee_id)
          }
        )
        .then(result => {
          if (!result) {
            response.status(404).send({
              error: "user not found"
            });
          }
          else {
            let safety_card = {
                EmployeeID: ObjectID(employee_id),
                DateCreated: date_today,
                DateModified: date_today,
                JobName: job_name,
                JobDescription: job_description,
                Dangers: dangers,
                Geolocation: {
                  type: "Point",
                  coordinates: [
                    longitude,
                    latitude
                  ]
                },
                isDeleted: false
            };

            // insert record
            return db.collection("reports")
                .insertOne(safety_card)
                .then(result => {
                    return result.ops[0];
                })
                .catch(err => {
                    response.status(500).send({ error: err });
                });
          }
        })
        .then(employee => {
          db.collection("users")
            .updateOne(
              {
                _id : ObjectID(employee.EmployeeID)
              },
              {
                $inc: { Points: 1 }
              }
            )
            .then(result => {
              response.status(200).send({
                success: true,
                message: "Report submitted!"
              })
            })
            .catch(error => {
              response.status(500).send({
                success: false,
                error: error.message
              });
            });
        })
        .catch(error => {
          response.status(500).send({
            success: false,
            error: error.message
          });
        });
    }
}
