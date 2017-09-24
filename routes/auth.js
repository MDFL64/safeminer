"use strict";
const bcrypt = require("bcrypt");

module.exports.get_login = (req, res) => {
	res.render("login.html");
}

module.exports.get_register = (req, res) => {
	res.render("register.html");
}

module.exports.post_register = (req, res) => {
	const db = req.db;

	const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const email 	 = req.body.Email;
	const position = req.body.Position;
	const name 		 = req.body.Name;
	const password = req.body.Password;

	let template_user = {Email: email, Name: name, Position: position};

	if (!EMAIL_REGEXP.test(email)) {
		res
		.status(400)
		.render("register.html",{msg: "Invalid email!", form_user: template_user});
	}
	else if (!name || !(typeof name === "string")) {
		res
		.status(400)
		.render("register.html",{msg: "Missing name!", form_user: template_user});
	}
	else if (!position || !(typeof position === "string")) {
		res
		.status(400)
		.render("register.html",{msg: "Missing job title!", form_user: template_user});
	}
	else {
		db.collection("users")
			.findOne({"Email": email})
			.then(user => {
				if (user) {
					res
					.status(400)
					.render("register.html",{msg: "User already exists!", form_user: template_user});
				}
				else {
					bcrypt.hash(password, 10)
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
							res.render("register_good.html", {form_user: template_user});
						})
						.catch(function(err) {
							res
							.status(500)
							.render("register.html",{msg: "Something went wrong!", form_user: template_user});
						});
				}
			})
			.catch(error => {
				res
				.status(500)
				.render("register.html",{msg: "Something went wrong!", form_user: template_user});
			});
	}
}

module.exports.logout = (req, res) => {
	req.logout();
  req.session.destroy();
  res.redirect('/api/auth/login');
}
