const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: "sbentleywd@gmail.com",
		subject: "Welcome to task-manager",
		text: `Hi ${name}. Thanks for signing up!`,
	});
};

const sendGoodbyeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: "sbentleywd@gmail.com",
		subject: "Goodbye",
		text: `Goodbye ${name}. Is there anything we could have done better?`,
	});
};

module.exports = {
	sendWelcomeEmail,
	sendGoodbyeEmail,
};
