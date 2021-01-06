const supertest = require("supertest");
const request = require("supertest");
const app = require("../src/app");

test("should sign up a new user", async () => {
	await request(app)
		.post("/users")
		.send({
			name: "Gary Gibbon",
			email: "Gary@example.com",
			password: "gibbon123",
		})
		.expect(201);
});
