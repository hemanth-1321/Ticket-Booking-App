import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

console.log(accountSid, authToken);
export async function sendMessage(to: string, body: string) {
  const message = await client.messages.create({
    body: body,
    from: "+12184032424",
    to: to,
  });
  console.log(message.body);
}
