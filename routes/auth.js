"use strict";
const bcrypt = require("bcrypt");

module.exports.register = (req, res) => {
	const db = req.db;

	const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const email = req.body.Email;
	const position = req.body.Position;
	const name = req.body.Name;
	const password1 = req.body.Password1;
	const password2 = req.body.Password2;


	if (!EMAIL_REGEXP.test(email)) {
		res.status(400).send({
			success: false,
			message: "Invalid email"
		});
	}
	else if (!name || !(typeof name === "string")) {
		res.status(400).send({
			success: false,
			message: "Wrong email field"
		});
	}
	else if (!position || !(typeof position === "string")) {
		res.status(400).send({
			success: false,
			message: "Missing Position"
		});
	}
	else if (password1 != password2) {
		res.status(400).send({
			success: false,
			message: "Passwords do not match"
		})
	}
	else {
		db.collection("users")
			.findOne({"Email": email})
			.then(user => {
				if (user) {
					res.status(400).send({
						success: false,
						message: "User already exists!"
					});
				}
				else {
					bcrypt.hash(password1, 10)
						.then(hash => {
							let user = {
								Email: email,
								Password: hash,
								Name: name,
								Position: position,
								Points: 0
							};

							return db.collection("users").insertOne(user);
						})
						.then(user => {
							res.status(200).send(user.ops[0]);
						})
						.catch(function(err) {
							res.status(500).send("Something went wrong");
						});
				}
			})
			.catch(error => {
				res.status(500).send("Something went wrong");
			});
	}
}
