const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		age: {
			type: Number,
			default: 0,
			validate(value) {
				if (value < 0) {
					throw new Error("Age must be a positive number");
				}
			},
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email is invalid");
				}
			},
		},
		password: {
			type: String,
			required: true,
			minLength: 7,
			trim: true,
			validate(value) {
				if (value.toLowerCase().includes("password")) {
					throw new Error('Password cannot contain "password"');
				}
			},
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		avatar: {
			type: Buffer,
		},
		groups: [
			{
				group: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

userSchema.virtual("tasks", {
	ref: "Task",
	localField: "_id",
	foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign(
		{ _id: user.id.toString() },
		process.env.JWT_SECRET,
		{
			expiresIn: 60 * 90, // 90 mins
		}
	);
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};

// delete expired tokens
userSchema.methods.cleanTokens = async function () {
	const user = this;
	user.tokens = user.tokens.filter((token) => {
		try {
			const decoded = jwt.verify(token.token, process.env.JWT_SECRET);
			return decoded;
		} catch (e) {
			return false;
		}
	});

	await user.save();
	return;
};

// overides default toJSON method to remove password & tokens
userSchema.methods.toJSON = function () {
	const user = this;
	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.tokens;
	delete userObj.avatar;
	return userObj;
};

// static methods are accessible on the model(in this case User), methods are accessible on the instance of a model (in this case user)
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("Unable to log in");
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		throw new Error("Unable to log in");
	}

	return user;
};

// hash the plaintext password before saving
userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
	const user = this;
	await Task.deleteMany({
		owner: user._id,
	});
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
