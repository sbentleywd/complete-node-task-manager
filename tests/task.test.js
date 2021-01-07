const request = require("supertest");
const Task = require("../src/models/task");
const {
	user1Id,
	user1,
	setupDatabase,
	user2Id,
	user2,
	task1,
} = require("./fixtures/db");
const app = require("../src/app");

beforeEach(setupDatabase);

test("Should create task for a user", async () => {
	const response = await request(app)
		.post("/tasks")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.send({
			description: "from my test",
		})
		.expect(201);

	const task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();
	expect(task.completed).toEqual(false);
});

test("Should get all tasks for a user", async () => {
	const response = await request(app)
		.get("/tasks")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.expect(200);

	expect(response.body.length).toEqual(2);
});

test("Should not allow a user to delete a different user's task", async () => {
	const response = await request(app)
		.delete(`/task/${task1._id}`)
		.set("Authorization", `Bearer ${user2.tokens[0].token}`)
		.expect(404);
	const task = await Task.findById(task1._id);
	expect(task).not.toBeNull();
});
