const ObjectID = require('mongodb').ObjectID;

module.exports.get_safetycard_all = (request, response) => {
  const db = request.db;

  db.collection("SafetyCards")
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
    db.collection("SafetyCards")
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

module.exports.post_safetycard = (request, response) => {
    const db = request.db
    const date_today = new Date();

    db.collection("SafetyCards")
        .insertOne({
            EmployeeID: request.body.employeeId,
            DateCreated: date_today,
            DateModified: date_today,
            JobName: request.body.jobName,
            JobDescription: request.body.jobDescription,
            Dangers: request.body.dangers,
            Geolocation: null,
            isDeleted: false
        })
        .then(result => {
            response.status(201).send(result);
        })
        .catch(err => {
            response.status(500).send({ error: err });
        });
}
