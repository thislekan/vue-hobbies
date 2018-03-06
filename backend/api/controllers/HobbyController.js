/**
 * HobbyController
 *
 * @description :: Server-side logic for managing Hobbies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const _ = require("lodash");
const { ObjectID } = require("mongodb");
const { Hobby } = require('./../models/Hobby');

module.exports = {



	/**
	 * `HobbyController.create()`
	 */
	create: function (req, res) {
		// return res.json({
		// 	todo: 'create() is not implemented yet!'
		// });
		let hobby = new Hobby({
			hobbies: req.body.hobbies,
			creator: req.user._id,
			creatorName: req.user.name
		});
		hobby.save().then(doc => {
			res.send(doc)
		}, e => res.status(400).send(e));
	},


	/**
	 * `HobbyController.read()`
	 */
	read: function (req, res) {
		// return res.json({
		// 	todo: 'read() is not implemented yet!'
		// });
		let id = req.params.id;
		if (!ObjectID(id)) {
			return res.status(404).send('No hobby found for this User')
		}
		Hobby.findOne({
			_id: ObjectID(id),
			creator: ObjectID(req.user._id)
		}).then(hobbies => {
			if (!hobbies) {
				res.status(404).send('This User is yet to create their hobby');
			}
			res.status(200).send({ hobbies })
		}).catch(e => res.status(400).send(e));
	},


	/**
	 * `HobbyController.delete()`
	 */
	delete: function (req, res) {
		// return res.json({
		// 	todo: 'delete() is not implemented yet!'
		// });
		let id = req.params.id;
		if (!ObjectID(id)) {
			return res.status(404).send('No hobbies found for this user');
		}
		Hobby.findOneAndRemove({
			_id: ObjectID(id),
			creator: ObjectID(req.user._id)
		}).then(hobbies => {
			if (!hobbies) {
				res.status(404).send('This user is yet to create their hobbies');
			}
			res.status(200).send({ hobbies });
		}, e => res.status(400).send(e));
	},


	/**
	 * `HobbyController.update()`
	 */
	update: function (req, res) {
		// return res.json({
		// 	todo: 'update() is not implemented yet!'
		// });
		let id = req.params.id;
		var body = _.pick(req.body, ["hobbies"]);
		if (!ObjectID(id)) {
			return res.status(404).send('No hobbies found for this user');
		}
		Hobby.findOneAndUpdate({
			_id: ObjectID(id),
			creator: ObjectID(req.user._id)
		}, { $set: body }, { new: true }).then(hobbies => {
			if (!hobbies) {
				res.status(404).send('This user is yet to create their hobbies');
			}
			res.status(200).send({ hobbies })
		}, e => res.status(400).send(e));
	}
};

