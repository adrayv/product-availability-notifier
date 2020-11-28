require("dotenv").config();

const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

module.exports = async (message) => {
  try {
    const twilioRes = await client.messages.create({
      to: process.env.TWILIO_TO,
      from: process.env.TWILIO_FROM,
      body: message,
    });
    console.log("TWILIO RES", { twilioRes });
  } catch (err) {
    console.error("TWILIO ERR", { err });
  }
};
