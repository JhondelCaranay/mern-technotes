const router = require("express").Router();
const path = require("path");

router.all("^/$|/index(.html)?", (req, res) => {
	if (req.accepts("html")) {
		res.status(404).sendFile(path.join(__dirname, "..", "views", "404.html"));
	} else if (req.accepts("json")) {
		res.status(404).json({ message: "404 Not Found" });
	} else {
		res.status(404).type("txt").send("404 Not Found");
	}
});

module.exports = router;
