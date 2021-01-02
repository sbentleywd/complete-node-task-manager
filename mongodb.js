// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require("mongodb");

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
	connectionUrl,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(error, client) => {
		if (error) {
			return console.log("Unable to connect to database");
		}

		const db = client.db(databaseName);

		db.collection("users")
			.deleteMany({
				age: 36,
			})
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.log(error);
			});

		db.collection("tasks")
			.deleteOne({
				description: "Buy snacks",
			})
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.log(error);
			});
	}
);
