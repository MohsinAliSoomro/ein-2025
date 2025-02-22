const ses = require("node-ses");
const sails = require("sails");
console.log({ sails });
const client = ses.createClient({
  key: sails.config?.custom?.sesKey,
  secret: sails.config.custom.sesSecret,
});

module.exports = {
  friendlyName: "Send status email",

  description: "",

  inputs: {
    name: {
      type: "string",
    },
    company: {
      type: "string",
    },
    phone: {
      type: "string",
    },
    email: {
      type: "string",
    },
    subject: {
      type: "string",
    },
    message: {
      type: "string",
    },
    jobNumber: {
      type: "string",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({
    name,
    company,
    phone,
    email,
    subject,
    message,
    jobNumber = "",
  }) {
    // TODO
    client.sendEmail(
      {
        to: sails.config.custom.supportEmail,
        from: sails.config.custom.senderEmail,
        subject: `${subject}`,
        message: `
      <p>Hi,</p>
      <p>
      Name: ${name}<br/>
      Company: ${company}<br/>
      Email: ${email}<br/>
      Phone: ${phone}<br/>
      ${jobNumber}</p>
      <p>${message}</p>
      <p></p>
      <p>Best Regards,<br/>
      Team EIN</p>
      `,
      },
      function (err, data, res) {
        // ...

        if (err) {
          console.log({ err });
          // throw "error in sending email"
        } else {
          // console.log({ data, res })
          console.log("send-status-email");
        }
      }
    );
  },
};
