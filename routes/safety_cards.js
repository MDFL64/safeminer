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

// module.exports.post_safetycard = (request, response) => {
//   const db = req.db;
//
//   const employee_id   =
//   const date_created  =
//   const date_modified =
//   const job_name      =
//   const job_desc      =
//   const Dangers
// }
