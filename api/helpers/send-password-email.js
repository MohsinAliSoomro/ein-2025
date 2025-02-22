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
    email: {
      type: "string",
    },

    link: {
      type: "string",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ email, link }) {
    // TODO
    // console.log({email,link});
    client.sendEmail(
      {
        to: email,
        from: sails.config.custom.senderEmail,
        subject: "EIN Reset Password Request",
        message: `
      <p>
      <strong>Click here to reset your password</strong>
      </p>
      <p>
      <a href="${link}">${link.split("?token")[0]}
      </a>
      </p>
      <p>Best Regards,</p>
      <p>Team EIN</p>

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
