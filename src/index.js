const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log(`Server is up on ${port}`);
});

const bcrypt = require("bcryptjs");

// const myFunction = async () => {
// 	const password = "Cant0na123";
// 	const hasedPassword = await bcrypt.hash(password, 8);
// 	console.log(password);
// 	console.log(hasedPassword);

// 	const isMatch = await bcrypt.compare("Cant0na123", hasedPassword);
// 	console.log(isMatch);
// };
// myFunction();
