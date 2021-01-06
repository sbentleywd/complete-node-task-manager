const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const user1 = {
	name: "Gary Neville",
	email: "gaz@example.com",
	password: "rightback2",
};

beforeEach(async () => {
	await User.deleteMany();
	await new User(user1).save();
});

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

test("Should log in existing user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: user1.email,
			password: user1.password,
		})
		.expect(200);
});

test("Should not log in non existant user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: "blah@blah.com",
			password: "blahblahblah",
		})
		.expect(400);
});
