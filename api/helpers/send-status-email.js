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
    candidateId: {
      type: "string",
    },
    jobId: {
      type: "string",
    },
    status: {
      type: "string",
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function ({ candidateId, jobId, status }) {
    // TODO
    const candidate = await Candidate.findOne({ id: candidateId });
    const job = await Job.findOne({ id: jobId });
    const { email } = candidate;
    const allStatus = {
      applied: "Applied",
      shortlisted: "Shortlisted",
      downloaded: "Downloaded",
      interviewScheduled: "Interview Scheduled",
      notInterested: "Not Interested",
      closed: "Closed",
    };
    client.sendEmail(
      {
        to: "pranav.pieces@gmail.com",
        from: "pranav.pieces@gmail.com",
        subject: "Application status changed",
        message: `
      <p>Hello ${candidate.firstName},</p>
      <p>This is regarding your application for the posting -${job.title} </p>
      The status of your application was changed to ${allStatus[status]}.
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
