const passport = require("passport");
const {
  facebookClientID,
  facebookClientSecret,
  facebookCallbackURL,
  facebookStateSecret,
} = sails.config.custom;
const axios = require("axios");
const path = require("path");
const uuid = require("uuid").v4;
const jwt = require("jsonwebtoken");
const jwtSecret = "adnchycHhasdhDJNSInakddm@98389*@";
// const parser = require('../../library/parser/ResumeParser')

module.exports = {
  signupView: (req, res) => {
    res.view("candidate/candidate-signup");
  },

  loginView: (req, res) => {
    res.view("candidate/candidate-login");
  },
  profileView: async (req, res) => {
    const { candidateId } = req.session;
    const candidate = await Candidate.findOne({ id: candidateId });
    console.log("================", candidate);
    res.view("candidate/candidate-profile", { candidate });
  },

  myResumeView: async (req, res) => {
    const { candidateId } = req.session;
    const candidate = await Candidate.findOne({ id: candidateId })

      .populate("resumeId")
      .populate("skillList")
      .populate("skills")
      .populate("educationList")
      .populate("experienceList")
      .populate("otherLocationList");
    console.log("create resume ===>", candidate);

    res.view("candidate/my-resume", { candidate });
  },

  signup: async (req, res) => {
    console.log("candidate signup ==>", req.body);
    try {
      const generateNumber = () => {
        let candidateNo = new Date().getTime();
        return `EINC${candidateNo}`;
      };
      const { email } = req.body;
      const candidateNumber = await generateNumber();
      const candidate = await Candidate.create({
        ...req.body,
        candidateNumber,
      }).fetch();

      if (candidate) {
        res.status(200).json({
          status: "SUCCESS",
          message: "Sign up successful.",
        });
        const token = jwt.sign({ id: candidate.id }, jwtSecret);
        const link = `http://${req.get("host")}/verify-account?token=${token}`;
        await sails.helpers.sendVerificationEmail(email, link);
      }
    } catch (error) {
      console.log(error);
      if (error.code === "E_UNIQUE") {
        return res.badRequest("Email already registered.");
      }
      res.badRequest("Something Went Wrong.");
    }
  },

  login: function (req, res) {
    console.log("candidate login ==>", req.body);

    passport.authenticate("CandidateLogin", async (err, candidate, info) => {
      if (err) {
        return res.badRequest("Something Went Wrong.");
      }
      if (!candidate) {
        return res.badRequest(info.message);
      }

      // console.log('passport Data => ', candidate);
      req.session.candidateId = candidate.id;
      req.session.email = candidate.email;
      req.session.firstName = candidate.firstName;
      req.session.lastName = candidate.lastName;
      req.session.role = "candidate";
      req.session.profileImage = candidate.profileImage;
      req.session.coverImage = candidate.coverImage;
      let redirectUrl;
      // if (!candidate.gender) {
      //   redirectUrl = 'profile'
      // }
      // else
      console.log("=============", req.session);
      if (
        req.session.redirectUrl &&
        req.session.redirectUrl.includes("candidate")
      ) {
        redirectUrl = req.session.redirectUrl;
      } else {
        redirectUrl = "my-resume";
        // redirectUrl = 'dashboard';
      }
      console.log("====", req.session);

      await Candidate.updateOne(
        { id: req.session.candidateId },
        { lastLogin: new Date() }
      );

      res.status(200).json({
        status: "SUCCESS",
        message: info.message,
        redirectUrl,
      });
    })(req, res);
  },

  profileUpdate: async (req, res) => {
    console.log("candidate edit ==>", req.body);

    const { id } = req.body;
    try {
      const candidate = await Candidate.updateOne({ id }, { ...req.body });
      if (candidate) {
        res.status(200).json({
          status: "SUCCESS",
          message: "Updated successfully.",
        });
      }
    } catch (error) {
      console.log(error);
      if (error.code === "E_UNIQUE") {
        return res.badRequest("Email already exists.");
      }
      res.badRequest("Something Went Wrong.");
    }
  },
  uploadResume: async (req, res) => {
    const { candidateId } = req.session;

    const { uploadedResume, employmentType = [] } = req.body;

    let resume = await Resume.findOne({ candidateId });

    let uploadedResumeFile;
    if (uploadedResume !== "undefined") {
      uploadedResumeFile = new Promise((resolve, reject) => {
        req.file(`uploadedResume`).upload(
          {
            dirname: "../../resumes/",
            saveAs: function (__newFileStream, cb) {
              console.log(
                "--------- __newFileStream ",
                __newFileStream.filename
              );
              const ext = path.extname(__newFileStream.filename);
              myUniqueName = candidateId + "-resume" + ext;
              cb(null, myUniqueName);
            },
            maxBytes: 5000000,
          },
          (err, file) => {
            if (err) {
              reject(err);
            } else {
              resolve(file[0]);
            }
          }
        );
      });
    }
    const uploadedFile = await uploadedResumeFile;
    console.log("filename is = 2 ", uploadedFile);
    const fileName =
      uploadedFile && uploadedFile.fd.split("resumes")[1].replace(/\\/g, "/");
    req.body.uploadedResume = fileName;
    console.log("filename is = 3 ", fileName);
    if (!resume) {
      resume = await Resume.create({ candidateId }).fetch();
    } else {
      resume = await Resume.updateOne({ candidateId }, { employmentType });
    }

    // const data = await parser.parseResume(fileName);
    console.log("************", data);
    res.status(200).json({
      status: "SUCCESS",
      message: "Resume updated successfully.",
      data,
      // redirectUrl
    });
  },
  resumeUpdate: async (req, res) => {
    console.log("resumeUpdate==>", req.body);
    try {
      const { candidateId } = req.session;
      const {
        uploadedResume,
        employmentType = [],
        gender,
        profileFor,
        facebook,
        twitter,
        google,
        linkedin,
        relocate,
      } = req.body;

      let resume = await Resume.findOne({ candidateId });

      // let uploadedResumeFile
      // if (uploadedResume !== 'undefined') {

      //   uploadedResumeFile = new Promise((resolve, reject) => {
      //     req.file(`uploadedResume`).upload(
      //       {
      //         dirname: "../../assets/images/",
      //         saveAs: candidateId + '-resume.pdf',
      //         maxBytes: 5000000
      //       },
      //       (err, file) => {
      //         if (err) {
      //           reject(err);
      //         } else {
      //           resolve(file[0]);
      //         }
      //       }
      //     );
      //   });
      // }
      // const uploadedFile = await uploadedResumeFile
      // req.body.uploadedResume = uploadedFile && uploadedFile.fd.split('assets')[1].replace(/\\/g, '/')

      if (!resume) {
        resume = await Resume.create({ ...req.body, candidateId }).fetch();
      } else {
        resume = await Resume.updateOne(
          { candidateId },
          { ...req.body, employmentType }
        );
      }
      await Candidate.updateOne(
        { id: candidateId },
        {
          resumeId: resume.id,
          gender,
          profileFor,
          facebook,
          twitter,
          google,
          linkedin,
          relocate,
          isProfileCompleted: true,
        }
      );

      let {
        skillsData = [],
        educationData = [],
        experienceData = [],
        locationData = [],
      } = req.body;
      skillsData = Array.isArray(skillsData)
        ? []
        : JSON.parse(skillsData).filter((el) => el.name);
      educationData = Array.isArray(educationData)
        ? []
        : JSON.parse(educationData).filter((el) => el.collegeName);
      experienceData = Array.isArray(experienceData)
        ? []
        : JSON.parse(experienceData).filter((el) => el.employer);
      locationData = Array.isArray(locationData)
        ? []
        : JSON.parse(locationData).filter((el) => el.city);

      let skillListDb = await Skill.find({ where: {}, select: "name" });
      skillListDb = skillListDb.map((el) => el.name);

      const promises = skillsData.map(async (skill) => {
        if (!skill.name) {
          return;
        }
        if (!skillListDb.includes(skill.name)) {
          return await Skill.create({
            name: skill.name,
            searchKey: skill.name.toLowerCase(),
          });
        }
      });
      await Promise.all(promises);

      await Experience.destroy({ candidateId });
      await Experience.createEach(
        experienceData.map((el) => ({
          ...el,
          candidateId,
          resumeId: resume.id,
        }))
      );

      await Education.destroy({ candidateId });
      await Education.createEach(
        educationData.map((el) => ({ ...el, candidateId, resumeId: resume.id }))
      );

      await CandidateSkillMap.destroy({ candidateId });
      await CandidateSkillMap.createEach(
        skillsData.map((el) => ({
          ...el,
          skillId: el.name,
          candidateId,
          resumeId: resume.id,
        }))
      );

      if (locationData.length > 0) {
        await OtherLocation.destroy({ candidateId });
        await OtherLocation.createEach(
          locationData.map((el) => ({ ...el, candidateId }))
        );
      }

      res.status(200).json({
        status: "SUCCESS",
        message: "Resume updated successfully.",
        // redirectUrl
      });
    } catch (error) {
      console.log(error);
      res.badRequest("Something Went Wrong.");
    }
  },

  logout: function (req, res) {
    console.log("LOGOUT");
    req.session.destroy();
    res.redirect("/");
  },

  jobDetails: async (req, res) => {
    const id = req.param("id");
    if (!id) {
      res.view("404");
    }
    const { candidateId } = req.session;
    const job = await Job.findOne({ id })
      .populate("skills")
      .populate("employerId");
    // .populate('appliedCandidates')

    job.applied = await JobCandidateMap.count({ jobId: id, candidateId });
    const questions = await EmployerQuestion.find({ jobId: id, status: true });
    const answersObj = await CandidateAnswers.find({ jobId: id, candidateId });
    const answers = [];
    for (let i in answersObj) {
      answers[answersObj[i].employerQuestionId] = answersObj[i].answer;
    }
    console.log("questions ==========>", questions, answers);
    res.view("candidate/job-details-candidate", { job, questions, answers });
  },

  browseJobs: async (req, res) => {
    console.log("browseJobs", req.allParams());
    const { candidateId } = req.session;
    // const { query = '',
    //   limit = 20,
    //   city = '',
    //   state = '',
    //   category = '',
    // } = req.allParams()
    const jobNumber = req.param("jobNumber") || "";
    const query = req.param("query") || "";
    const limit = req.param("limit") || 20;
    const city = req.param("city") || "";
    const state = req.param("state") || "";
    const category = req.param("category") || "";
    let skills = req.param("skills");

    const searchQuery = {
      category: category,
      city: { contains: city },
      state: { contains: state },
      or: [
        { title: { contains: query } },
        { title: { contains: toTitleCase(query) } },
        { company: { contains: query } },
        { company: { contains: toTitleCase(query) } },
      ],
    };

    let jobIds = [];
    if (skills) {
      skills = JSON.parse(skills).map((el) => el.toLowerCase());
      skills = await Skill.find({ searchKey: skills }).populate("jobs", {
        select: "id",
      });
      for (const skill of skills) {
        for (const job of skill.jobs) {
          if (!jobIds.includes(job.id)) {
            jobIds.push(job.id);
          }
        }
      }
      searchQuery.id = jobIds;
    }

    let keyArray = ["city", "state", "category"];
    for (const key of keyArray) {
      if (!searchQuery[key]) {
        delete searchQuery[key];
      }
    }

    const jobList = await Job.find(searchQuery)
      .populate("employerId")
      .populate("skills");

    let candidate = await Candidate.findOne({ id: candidateId }).populate(
      "appliedJobs",
      { select: "id" }
    );
    appliedJobIdList = candidate.appliedJobs.map((el) => el.id);
    for (const job of jobList) {
      if (appliedJobIdList.includes(job.id)) {
        job.isApplied = true;
      } else {
        job.isApplied = false;
      }
    }
    // console.log(jobList);
    const skillList = await Skill.find();

    res.view("candidate/browse-jobs-list", { jobList, skillList });
  },
  jobApply: async (req, res) => {
    console.log("jobApply==>", req.body);
    try {
      const { candidateId } = req.session;
      const { jobId } = req.body;

      const answers = req.body.answers ? JSON.parse(req.body.answers) : [];
      const candidateAns = await CandidateAnswers.find({
        jobId,
        candidateId,
      });

      const questionIds = candidateAns.map((q) => q.employerQuestionId);
      const ansPromises = answers.map(async (param) => {
        if (questionIds.indexOf(param.questionId) !== -1) {
          return await CandidateAnswers.updateOne(
            {
              employerQuestionId: param.questionId,
              jobId,
              candidateId,
            },
            {
              answer: param.answer,
            }
          );
        } else {
          return await CandidateAnswers.create({
            answer: param.answer,
            employerQuestionId: param.questionId,
            jobId,
            candidateId,
          });
        }
      });
      await Promise.all(ansPromises);

      await Candidate.addToCollection(candidateId, "appliedJobs", jobId);
      res.status(200).json({
        status: "SUCCESS",
        message: "Applied successfully",
      });
    } catch (error) {
      console.log(error);
      res.badRequest("Couldn't apply.Please try again later.");
    }
  },
  verifyAccount: async (req, res) => {
    console.log("verifyAccount==>", req.allParams());
    const { token } = req.allParams();
    const tokenData = jwt.verify(token, jwtSecret);
    try {
      // console.log({tokenData});
      const { id } = tokenData;
      const candidate = await Candidate.findOne({ id });
      if (!candidate) {
        throw "no candidate found";
      } else {
        await Candidate.updateOne({ id }, { isVerified: true });

        req.session.candidateId = candidate.id;
        req.session.email = candidate.email;
        req.session.firstName = candidate.firstName;
        req.session.lastName = candidate.lastName;
        req.session.role = "candidate";
        req.session.profileImage = candidate.profileImage;
        req.session.coverImage = candidate.coverImage;
        res.redirect("/candidate/dashboard");
      }
    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  },
  jobWithdraw: async (req, res) => {
    console.log("jobWithdraw==>", req.body);
    try {
      const { candidateId } = req.session;
      const { jobId } = req.body;
      await Candidate.removeFromCollection(candidateId, "appliedJobs", jobId);
      res.status(200).json({
        status: "SUCCESS",
        message: "Withdrawn successfully",
      });
    } catch (error) {
      console.log(error);
      res.badRequest("Couldn't withdraw.Please try again later.");
    }
  },

  profileImage: async (req, res) => {
    console.log("Candidate profileImage==>");
    const { candidateId } = req.session;
    try {
      const imageFile = new Promise((resolve, reject) => {
        req.file(`image`).upload(
          {
            dirname: "../../assets/images/",
            saveAs: candidateId + "-profile-image",
          },
          (err, file) => {
            if (err) {
              reject(err);
            } else {
              resolve(file[0]);
            }
          }
        );
      });

      const imageObject = await imageFile;
      if (imageObject) {
        const image = imageObject.fd.split("assets")[1].replace(/\\/g, "/");
        await Candidate.updateOne({ id: candidateId }, { image });
        req.session.profileImage = `${image}?${Math.random()}`;
        res.status(200).json({
          status: "SUCCESS",
          message: "Candidate image updated successfully.",
        });
      } else {
        res.badRequest("Something went wrong.");
      }
    } catch (error) {
      console.log(error);
      res.badRequest("Candidate image could not be updated .");
    }
  },

  googleLoginRedirect: function (req, res) {
    passport.authenticate("CandidateGoogleLogin", (err, candidate, info) => {
      if (err) {
        return res.badRequest("Something Went Wrong.");
      }
      if (!candidate) {
        return res.badRequest(info.message);
      }

      console.log("passport Data => ", candidate);
      req.session.candidateId = candidate.id;
      req.session.email = candidate.email;
      req.session.firstName = candidate.firstName;
      req.session.lastName = candidate.lastName;
      req.session.role = "candidate";
      req.session.profileImage = candidate.profileImage;
      req.session.coverImage = candidate.coverImage;
      let redirectUrl;
      // if (!candidate.gender) {
      //   redirectUrl = 'profile'
      // }
      // else
      if (!candidate.resumeId) {
        redirectUrl = "my-resume";
      } else if (
        req.session.redirectUrl &&
        req.session.redirectUrl.includes("candidate")
      ) {
        redirectUrl = req.session.redirectUrl;
      } else {
        redirectUrl = "dashboard";
      }
      // console.log(req.session)

      res.redirect(redirectUrl);
    })(req, res);
  },
  googleLogin: function (req, res) {
    passport.authenticate("CandidateGoogleLogin", {
      session: false,
      scope: ["profile", "email"],
    })(req, res);
  },
  facebookLogin: function (req, res) {
    res.redirect(
      `https://www.facebook.com/v9.0/dialog/oauth?client_id=${facebookClientID}&redirect_uri=${facebookCallbackURL}&state=${facebookStateSecret}&auth_type=rerequest&scope=email`
    );
  },
  facebookLoginRedirect: async function (req, res) {
    console.log("facebookLoginRedirect ==>", req.allParams());
    const { code } = req.allParams();
    try {
      const tokenResponse = await axios.get(
        `https://graph.facebook.com/v9.0/oauth/access_token?client_id=${facebookClientID}&redirect_uri=${facebookCallbackURL}&client_secret=${facebookClientSecret}&code=${code}`
      );

      console.log("tokenResponseData===>", tokenResponse.data);
      const { access_token: input_token, token_type: tokenType } =
        tokenResponse.data;
      const facebookAppToken = await axios.get(
        `https://graph.facebook.com/oauth/access_token?client_id=${facebookClientID}&client_secret=${facebookClientSecret}&grant_type=client_credentials`
      );
      // console.log({facebookAppToken})
      const { access_token } = facebookAppToken.data;
      const inspectToken = await axios.get(
        `https://graph.facebook.com/debug_token?input_token=${input_token}&access_token=${access_token}`
      );
      console.log(inspectToken.data);
      const { data: userIdData } = inspectToken.data;
      console.log({ userIdData });
      const { user_id } = userIdData;
      const facebookUserRequest = await axios.get(
        `https://graph.facebook.com/${user_id}?fields=name,email&access_token=${input_token}`
      );
      console.log(facebookUserRequest.data);
      const { name, email } = facebookUserRequest.data;
      const [firstName, lastName] = name.split(" ");
      Candidate.findOne({ where: { email }, omit: ["resetToken"] }).exec(
        async function (err, candidate) {
          console.log({ candidate });
          if (err) {
            console.log(err);

            res.redirect("login");
          }
          if (!candidate) {
            candidate = await Candidate.create({
              firstName,
              lastName,
              email,
              password: uuid(),
              profileFor: "Self",
            }).fetch();
          }
          if (candidate.status === "Inactive") {
            res.redirect("login");
            return "Your account is inactive.Please contact support. ";
          }
          req.session.email = candidate.email;
          req.session.candidateId = candidate.id;
          req.session.firstName = candidate.firstName;
          req.session.lastName = candidate.lastName;
          req.session.profileImage = candidate.image;
          req.session.gender = candidate.gender;
          req.session.role = "candidate";
          req.session.resumeId = candidate.resumeId;
          res.redirect("dashboard");
        }
      );
    } catch (error) {
      console.log(error);
      res.redirect("login");
    }
  },
  resendVerificationEmail: async (req, res) => {
    console.log("resendVerificationEmail=>");
    const { candidateId } = req.session;
    try {
      const candidate = await Candidate.findOne({ id: candidateId });
      const { id, email } = candidate;
      const token = jwt.sign({ id }, jwtSecret);
      const link = `http://${req.get("host")}/verify-account?token=${token}`;
      await sails.helpers.sendVerificationEmail(email, link);
      res.json({
        status: "SUCCESS",
        message: "Verification mail sent successfully.",
      });
    } catch (error) {
      console.log(error);
      res.badRequest("Could not resend verification mail.");
    }
  },
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
