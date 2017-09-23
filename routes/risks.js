const ObjectID = require('mongodb').ObjectID;

module.exports.get_risks = (req, res) => {
    const db = req.db;

    db.collction("risks")
        .find()
        .toArray()
        .then(result => {
            res.status(200).send({
                result
            });
        })
        .catch(err => {
            res.status(500).send({
                err
            });
        });
}

module.exports.get_risks_starting_with = (req, res) => {
    const db = req.db;

    db.collection("risks")
        .find({
            title: {$regex: ".*" + req.params.s}
        })
        .toArray()
        .then(result => {
            res.status(200).send({
                result
            });
        })
        .catch(err => {
            res.status(500).send({
                err
            });
        });
}

module.exports.post_risk = (req, res) => {
    const db = req.db;

    db.collection("risks")
        .insertOne({
            title: req.params.title,
            hasIcon: false
        })
        .then(result => {
            res.status(201).send({
                success: true,
                result
            });
        });
}
