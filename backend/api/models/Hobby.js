

/**
 * Hobby.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// module.exports = {

//   attributes: {

//   }
// };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HobbySchema = new Schema({
	hobbies: {
		type: [{
			type: String,
			trim: true,
			minlength: 1,
			required: true
		}]
	},
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	creatorName: {
		type: String,
		trim: true
	}
});

const Hobby = mongoose.model('Hobby', HobbySchema);

module.exports = { Hobby }
