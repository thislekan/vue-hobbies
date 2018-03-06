/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		minlength: 1,
		trim: true,
		required: true
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: `{value} is not a valid email`,
			isAsync: true
		}
	},
	password: {
		type: String,
		minlength: 6,
		required: true
	},
	tokens: [
		{
			access: {
				type: String,
				required: true
			},
			token: {
				type: String,
				required: true
			}
		}
	],
	phone: {
		type: Number,
		required: true
	}
});

UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	return _.pick(userObject, ["_id", "email", "name", "phone"]);
};

UserSchema.methods.generateAuthToken = function () {
	const user = this;
	const access = "auth";
	const token = jwt
		.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET, {
			expiresIn: "24h"
		})
		.toString();

	if (user.tokens.length > 3) {
		user.tokens.pop();
	}

	user.tokens.push({ access, token });

	return user.save().then(() => {
		return token;
	});
};

UserSchema.methods.removeToken = function (token) {
	const user = this;

	return user.update({
		$pull: {
			tokens: { token }
		}
	});
};

UserSchema.statics.findByToken = function (token) {
	const User = this;
	var decoded;

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET);
	} catch (e) {
		return Promise.reject();
	}

	return User.findOne({
		_id: decoded._id,
		"tokens.token": token,
		"tokens.access": "auth"
	});
};

UserSchema.statics.findByCredentials = function (email, password) {
	const User = this;

	return User.findOne({ email }).then(user => {
		if (!user) {
			return Promise.reject();
		}
		return new Promise((resolve, reject) => {
			// Use bcrypt.compare to compare password and user.password
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					resolve(user);
				} else {
					reject();
				}
			});
		});
	});
};

UserSchema.methods.regenerateAuthToken = function () {
	const user = this;
	const access = "auth";
	const token = jwt
		.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET, {
			expiresIn: "1h"
		})
		.toString();

	if (user.tokens.length > 3) {
		user.tokens.pop();
	}

	user.tokens.push({ access, token });

	return user.save().then(() => {
		return token;
	});
};

UserSchema.pre("save", function (next) {
	const user = this;
	if (user.isModified("password")) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});


const User = mongoose.model("User", UserSchema);

module.exports = { User };
