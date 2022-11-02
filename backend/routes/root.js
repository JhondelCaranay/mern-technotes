const router = require("express").Router();
const path = require("path");
// ^ start of string
// $ end of string
// | or
// (.html)? optional

// user can enter / or index ot index.html to hit the homepage
router.get("^/$|/index(.html)?", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
