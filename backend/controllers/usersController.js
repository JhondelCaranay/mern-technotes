const Note = require("../models/Note");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// lean() returns a plain javascript object instead of a mongoose document, use when not using mongoose methods like save()
// exec() returns a promise, turn non promise methods into promise methods

// @desc    Get all notes
// @route   GET /api/users
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find({}).select("-password").lean();

	if (!users?.length) {
		return res.status(400).json({ message: "No users found" });
	}

	res.status(200).json(users);
});

// @desc    Create new user
// @route   POST /api/users
// @access  Private
const createNewUser = asyncHandler(async (req, res) => {
	const { username, password, roles } = req.body;

	// confirm data
	if (!username || !password || !Array.isArray(roles) || !roles.length) {
		return res.status(400).json({ message: "All fields are required" });
	}

	// check if user exists
	const duplicate = await User.findOne({ username }).lean().exec(); // exec() is required to return a promise

	if (duplicate) {
		return res.status(400).json({ message: "Duplicate username" });
	}

	// hash password
	const salt = await bcrypt.genSalt(10);
	console.log(salt);
	const hashedPwd = await bcrypt.hash(password, salt);

	const userObject = {
		username,
		password: hashedPwd,
		roles,
	};

	// create an store new user
	const user = await User.create(userObject);

	if (user) {
		res.status(201).json({ message: `New user ${username} created` });
	} else {
		res.status(400).json({ message: "Invalid user data received" });
	}
});

// @desc    Update user
// @route   PATCH /api/users
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { username, password, roles, active } = req.body;

	// confirm data
	if (!username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
		return res.status(400).json({ message: "All fields are required" });
	}

	// check if user exists
	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	// check for duplicate
	const duplicate = await User.findOne({ username }).lean().exec();

	// check if id is not the same as the duplicate id
	if (duplicate && duplicate._id.toString() !== id) {
		return res.status(409).json({ message: "Duplicate username" });
	}

	user.username = username;
	user.roles = roles;
	user.active = active;

	if (password) {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
	}

	const updatedUser = await user.save();
	res.status(200).json({ message: `${updatedUser.username} updated` });
});

// @desc    Delete user
// @route   DELETE /api/users
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	console.log({ id });
	// Does the user still have assigned notes?
	const note = await Note.findOne({ user: id }).lean().exec();
	console.log({ note });

	if (note) {
		return res.status(400).json({ message: "User has assigned notes" });
	}

	// Does the user exist to delete?
	const user = await User.findById(id).exec();

	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	const result = await user.deleteOne();

	const reply = `Username ${result.username} with ID ${result._id} deleted`;

	res.status(200).json({ message: reply });
});

module.exports = {
	getAllUsers,
	createNewUser,
	updateUser,
	deleteUser,
};
