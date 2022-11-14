require("dotenv").config();
const express = require("express");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const { logger, logEvents } = require("./middlewares/logger");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 3500;
connectDB();

console.log(process.env.NODE_ENV);

// midlewares
app.use(logger); // custom logger middleware
app.use(cors(corsOptions));
app.use(express.json()); // recieve and parse json
app.use(cookieParser()); // parse cookies

// routes
app.use("/", express.static(path.join(__dirname, "public"))); // way 1
// app.use(express.static(path.join(__dirname, "public"))); 	way 2
// app.use(express.static("public"));							way 3 , whis will works because public file is relative to root directory

app.use("/", require("./routes/root"));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));

// 404 page
app.use("/", require("./routes/page404"));

// custom logger middleware
app.use(errorHandler);

// sever listening
mongoose.connection.once("open", () => {
	console.log("MongoDB Connected");

	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
});

mongoose.connection.on("error", (err) => {
	console.log(err);
	logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});
