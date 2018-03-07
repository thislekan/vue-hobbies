/**
 * UserController
 *
 * @description :: Server-side logic for managing Usercontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const _ = require("lodash");
const { ObjectID } = require("mongodb");
const { User } = require("./../models/User");
const AWS = require('aws-sdk');

const twilio = require('twilio');

console.log(process.env.NODE_ENV + 'confirmed');
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
AWS.config = new AWS.Config({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION })

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

module.exports = {
	/**
	 * `UserController.login()`
	 */

	login: function (req, res) {
		const body = _.pick(req.body, ["email", "password"]);
		User.findByCredentials(body.email, body.password)
			.then(user => {
				return user.generateAuthToken().then(token => {
					res.header("x-auth", token).send(user);
				});
			})
			.catch(e => {
				res.status(400).send();
			});
	},


	/**
	 * `UserController.reset()`
	 * resets password
	 */
	reset: function (req, res) {
		let email = req.params.email;
		User.findOne({ email }).then(user => {
			if (!user) {
				return Promise.reject();
			} else {
				//send email with new token as a link
				//forgot
			}
		});
	},


	/**
	 * `UserController.update()`
	 */
	update: function (req, res) {
		var id = req.params.id;
		var token = req.headers["x-auth"];
		var body = _.pick(req.body, ["name"]);
		if (!ObjectID.isValid(id)) {
			return res.status(404).send();
		}

		User.findOneAndUpdate(
			{
				_id: ObjectID(id),
				"tokens.token": req.headers["x-auth"]
			},
			{ $set: body },
			{ new: true }
		)
			.then(user => {
				if (!user) {
					return res.status(404).send();
				}
				res.status(200).send({ user });
			})
			.catch(e => res.status(400).send());
	},


	/**
	 * `UserController.create()`
	 */
	create: function (req, res) {
		const new_user = _.pick(req.body, ["email", "password", "name", "phone"]);
		const user = new User(new_user);
		user
			.save()
			.then(() => {
				return user.generateAuthToken();
			})
			.then(token => {
				res.header("x-auth", token).send(user);
			})
			.catch(e => res.status(400).send(e));
	},


	/**
	 * `UserController.logout()`
	 */
	logout: function (req, res) {
		req.user.removeToken(req.token).then(
			() => {
				res.status(200).send();
			},
			() => {
				res.status(400).send();
			}
		);
	},


	/**
	 * `UserController.confirm()`
	 */
	confirm: function (req, res) {
		// return res.json({
		// 	todo: 'confirm() is not implemented yet!'
		// });
		res.send(req.user);
	},

	/**
	 * `UserController.sendText()`
	 */
	sendText: function (req, res) {
		const phoneNumber = '+234' + req.user.phone;
		const body = req.body.text;
		client.messages.create({
			to: phoneNumber,
			from: process.env.TWILIO_NUMBER,
			body
		}).then(message => {
			console.log(message.sid);
			return message.sid;
		}).then(response => res.status(200).send(response)).catch(e => console.log(e));
	},
	/**
	 * `Usercontroller.sendEmail()`
	 */
	sendEmail: function (req, res) {
		const params = {
			Source: 'ibrahimlekanomoniyi@gmail.com',
			Destination: {
				ToAddresses: ['lekanomoniyi@yahoo.com']
			},
			Message: {
				Subject: {
					Charset: 'UTF-8',
					Data: req.body.subject
				},
				Body: {
					Text: {
						Charset: 'UTF-8',
						Data: req.body.text
					}
				}
			}
		}
		ses.sendEmail(params, (err, data) => {
			if (err) {
				throw err;
			}
			console.log(`Email sent: ${data}`)
			res.status(200).send(data);
		});
	}
};

