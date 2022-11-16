const jwt = require("jsonwebtoken");

const getAccessToken = (username, roles) => {
	return jwt.sign(
		{
			UserInfo: {
				username,
				roles,
			},
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "15m" }
	);
};

const getRefreshToken = (username) => {
	return jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = {
	getAccessToken,
	getRefreshToken,
};
