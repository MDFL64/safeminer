const bcrypt = require("bcrypt");

module.exports.register = (req, res) => {
	const db = req.db;
	
	const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	if (!EMAIL_REGEXP.test(req.body.Email)) {
		res.status(400).send("That does not look like an email.");
	} else if (!req.body.Name || !(typeof req.body.Name === "string")) {
		res.status(400).send("Missing Name field.");
	} else if (!req.body.Position || !(typeof req.body.Position === "string")) {
		res.status(400).send("Missing Position field.");
	} else if (req.body.Password1 != req.body.Password2) {
		res.status(400).send("Passwords do not match!");
	} else {
		db.collection("users").findOne({"Email": req.body.Email})
			.then(function(user) {
				if (user) {
					res.status(400).send("User already exists!");
				} else {
					bcrypt.hash(req.body.Password1, 10)
						.then(function(hash) {
							let user = {
								Email: req.body.Email,
								Password: hash,
								Name: req.body.Name,
								Position: req.body.Position,
								Points: 0
							};
				
							return db.collection("users").insertOne(user)
						})
						.then(function() {
							res.status(200).send("Registered!");
						})
						.catch(function(err) {
							res.status(500).send("Unknown error!");
						});
				}
			})
			.catch(function(err) {
				res.status(500).send("Unknown database error!");
			});
	}
}