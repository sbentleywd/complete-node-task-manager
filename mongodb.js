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

		// db.collection("users")
		// 	.updateOne(
		// 		{ _id: new ObjectID("5feb41bd719bf61295559f94") },
		// 		{
		// 			$inc: {
		// 				age: 1,
		// 			},
		// 		}
		// 	)
		// 	.then((result) => {
		// 		console.log(result);
		// 	})
		// 	.catch((error) => {
		// 		console.log(error);
		// 	});
		db.collection("tasks")
			.updateMany(
				{
					completed: false,
				},
				{
					$set: {
						completed: true,
					},
				}
			)
			.then((result) => {
				console.log(result);
			})
			.catch((error) => {
				console.log(error);
			});
	}
);
