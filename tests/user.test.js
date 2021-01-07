const request = require("supertest");
const { user1Id, user1, setupDatabase } = require("./fixtures/db");
const app = require("../src/app");
const User = require("../src/models/user");

beforeEach(setupDatabase);

test("should sign up a new user", async () => {
	const response = await request(app)
		.post("/users")
		.send({
			name: "Gary Gibbon",
			email: "Gary@example.com",
			password: "gibbon123",
		})
		.expect(201);

	// Assert that user was created correctly
	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();

	// Assertions about the response

	expect(response.body).toMatchObject({
		user: {
			name: "Gary Gibbon",
			email: "gary@example.com",
		},
		token: user.tokens[0].token,
	});

	expect(user.password).not.toBe("gibbbon123");
});

test("Should log in existing user", async () => {
	const response = await request(app)
		.post("/users/login")
		.send({
			email: user1.email,
			password: user1.password,
		})
		.expect(200);

	const user = await User.findById(response.body.user._id);
	expect(response.body).toMatchObject({
		token: user.tokens[1].token,
	});
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

test("Should get profile for user", async () => {
	await request(app)
		.get("/users/me")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.send()
		.expect(200);
});

test("Should not get profile for unathenticated user", async () => {
	await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for user", async () => {
	const response = await request(app)
		.delete("/users/me")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.send()
		.expect(200);

	const user = await User.findById(response.body._id);
	expect(user).toBeNull();
});

test("Should not delete account for unathenticated user", async () => {
	await request(app).delete("/users/me").send().expect(401);
});

test("should upload avatar image", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.attach("avatar", "tests/fixtures/philly.jpg")
		.expect(200);
	const user = await User.findById(user1Id);
	expect(user.avatar).toEqual(expect.any(Buffer));
});

// update name
test("Should update valid field", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.send({
			name: "Phil Neville",
		})
		.expect(200);
	const user = await User.findById(user1Id);
	expect(user.name).toBe("Phil Neville");
});

// attempt to update location field
test("Should not update invalid field", async () => {
	await request(app)
		.patch("/users/me")
		.set("Authorization", `Bearer ${user1.tokens[0].token}`)
		.send({
			position: "Left Back",
		})
		.expect(400);
});
