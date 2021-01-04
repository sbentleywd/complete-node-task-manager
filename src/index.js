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
app.use(morgan("dev"));
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});

const Task = require("./models/task");
const User = require("./models/user");

// const main = async () => {
// 	// find owner of a task from task id
// 	// const task = await Task.findById("5ff342e44a7f221e90dd4478");
// 	// await task.populate("owner").execPopulate();
// 	// console.log(task.owner);

// 	// find tasks associated with an owner
// 	const user = await User.findById("5ff342193ad1731dd24cd2a9");
// 	await user.populate("tasks").execPopulate();
// 	console.log(user.tasks);
// };

// main();
