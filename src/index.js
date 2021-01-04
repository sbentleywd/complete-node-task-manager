const express = require("express");
const morgan = require("morgan");
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

// custom middleware

// app.use((req, res, next) => {
// 	res.status(503).send("Site under maintenance");
// });

app.use(express.json());
app.use(morgan("tiny"));
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});
