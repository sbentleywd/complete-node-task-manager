const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({
	dest: "images",
	limits: {
		fileSize: 1000000, // 1MB
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(doc|docx)/)) {
			return cb(new Error("please upload a word document"));
		}
		cb(undefined, true);
	},
});

app.post("/upload", upload.single("upload"), (req, res) => {
	res.send();
});

app.use(express.json());
app.use(morgan("dev"));
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});
