const ses = require("node-ses");
const sails = require("sails");
const client = ses.createClient({
  key: sails.config.custom.sesKey,
  secret: sails.config.custom.sesSecret,
});

module.exports = {
  friendlyName: "Send status email",

  description: "",

  inputs: {
    usertype: {
      type: "string",
    },
    name: {
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
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ type, name, phone, email, subject, message }) {
    // TODO
    const allStatus = {
      recruiter: "Recruiter",
      candidate: "Candidate",
    };
    client.sendEmail(
      {
        to: sails.config.custom.contactEmail,
        from: sails.config.custom.senderEmail,
        subject: subject,
        message: `
      <p>Hi ${name},</p>
      <p>Email: ${email}<br/>
      Phone: ${phone}</p>
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
