const jwt = require('jsonwebtoken');
const jwtSecret = "addai823n83enmsd klasd;x'a.x,kcqdmlandhbediodm"
module.exports = {


  homepageView: async (req, res) => {
    res.render('index');
  },
  newHomepageView: async (req, res) => {
    const jobs = await Job.find({ 
      where: {
        status: "Active"
      }, 
      sort: 'createdAt DESC', 
      limit: 5 
    });
    console.log(jobs);
    res.render('index2', { layout: null, jobs });
  },
  servicespageView: async (req, res) => {
    res.render('services');
  },
  contactPageView: (req, res) => {
    const {name='', email='', phone=''} = req.session;
    let userType = req.session.candidateId ? 'candidate' : (req.session.employerId ? 'employer' : '');
    
    res.render('contact', { layout: null, userType, email, phone, name });
  },
  jobDetail: async(req, res) => {
   
    const id = req.param('id')
    if (!id) {
      res.view('404')
    }
    const { candidateId } = req.session || null;
    const job = await Job.findOne({ id })
      .populate('skills')
      .populate('employerId')
      // .populate('appliedCandidates')

    job.applied = await JobCandidateMap.count({ jobId: id, candidateId })
    const questions = await EmployerQuestion.find({jobId: id, status:true});
    const answersObj = await CandidateAnswers.find({jobId: id, candidateId});
    const answers = [];
    for(let i in answersObj){

      answers[answersObj[i].employerQuestionId] = answersObj[i].answer;
    }
    res.render('job-detail', { job, questions, answers });
  },
  searchJobs: async(req, res) => {
    const query = req.param('query') || ''
    const search = req.param('search') || ''
    const page = req.param('p') || 0
    const limit = 10
    const p = parseInt(page);
    const skip = p * limit;
    const city = req.param('city') || ''
    const state = req.param('state') || ''
    console.log('query ---------> ', query, skip, limit)
    let filter = {
      city,
      state
    };

    const searchQuery = {
      city: { contains: city },
      state: { contains: state },
      or: [
        { title: { contains: search } },
        { title: { contains: toTitleCase(search) } },
        { company: { contains: search } },
        { company: { contains: toTitleCase(search) } },
      ]
    }
    let skills = null;
    if(search)
      skills = typeof search == 'string' ? [search] : (typeof search == 'array' ? search : null);

    let jobIds = []
    if (skills) {
      skills = skills.map(el => el.toLowerCase())
      skills = await Skill.find({ searchKey: skills }).populate('jobs', { select: 'id' })
      for (const skill of skills) {
        for (const job of skill.jobs) {
          if (!jobIds.includes(job.id)) {
            jobIds.push(job.id)
          }
        }
      }
      // searchQuery.id = jobIds
      searchQuery['or'].push({id:jobIds});
    }

    let keyArray = ["city", "state"]
    for (const key of keyArray) {
      if (!searchQuery[key]) {
        delete searchQuery[key]
      }
    }
    const totJobs = await Job.count(searchQuery);

    const jobList = await Job.find(searchQuery)
      .populate('employerId')
      .populate('skills')
      .skip(skip)
      .limit(limit);

      console.log('-=-=-=-=-->>>', jobList)
    let totPage = totJobs > 0 ? totJobs/limit : 0;
    if(totPage > 0) {
      totPage = parseInt(totPage) + 1;
    }
    let queryString = req.query;
    delete queryString['p'];
    queryString = queryString ? objectToQueryString(queryString) : null;
    
    let previousPage = null;
    let nextPage = null;

    if(p > 0){
      previousPage = `?p=${p-1}` + (queryString ? `&${queryString}` : '');
    }

    if(p < totPage-1){
      nextPage = `?p=${p+1}` + (queryString ? `&${queryString}` : '');
    }

    res.render('search-job', { layout: null, jobList, filter, previousPage, nextPage });
  },
  findJobs: async(req, res) => {
    const query = req.param('query') || ''
    const search = req.param('search') || ''
    const page = req.param('p') || 0
    const limit = 20
    const p = parseInt(page);
    const skip = p * limit;
    const city = req.param('city') || ''
    const state = req.param('state') || ''
    console.log('query ---------> ', query, skip, limit)
    let filter = {
      city,
      state
    };

    const searchQuery = {
      city: { contains: city },
      state: { contains: state },
      or: [
        { title: { contains: search } },
        { title: { contains: toTitleCase(search) } },
        { company: { contains: search } },
        { company: { contains: toTitleCase(search) } },
      ]
    }
    let skills = null;
    if(search)
      skills = typeof search == 'string' ? [search] : (typeof search == 'array' ? search : null);

    let jobIds = []
    if (skills) {
      skills = skills.map(el => el.toLowerCase())
      skills = await Skill.find({ searchKey: skills }).populate('jobs', { select: 'id' })
      for (const skill of skills) {
        for (const job of skill.jobs) {
          if (!jobIds.includes(job.id)) {
            jobIds.push(job.id)
          }
        }
      }
      // searchQuery.id = jobIds
      searchQuery['or'].push({id:jobIds});
    }

    let keyArray = ["city", "state"]
    for (const key of keyArray) {
      if (!searchQuery[key]) {
        delete searchQuery[key]
      }
    }
    const totJobs = await Job.count(searchQuery);

    const jobList = await Job.find(searchQuery)
      .populate('employerId')
      .populate('skills')
      .skip(skip)
      .limit(limit);

      console.log('-=-=-=-=-->>>', jobList)
    let totPage = totJobs > 0 ? totJobs/limit : 0;
    if(totPage > 0) {
      totPage = parseInt(totPage) + 1;
    }
    let queryString = req.query;
    delete queryString['p'];
    queryString = queryString ? objectToQueryString(queryString) : null;
    
    let previousPage = null;
    let nextPage = null;

    if(p > 0){
      previousPage = `?p=${p-1}` + (queryString ? `&${queryString}` : '');
    }

    if(p < totPage-1){
      nextPage = `?p=${p+1}` + (queryString ? `&${queryString}` : '');
    }

    res.render('find-job', { layout: null, jobList, filter, previousPage, nextPage });
  },
  publicMessage: async (req, res) => {
    console.log("publicMessage", req.body);
    const { type, name, email, phone, subject, message } = req.body;
    try {

      const publicMessage = await PublicMessage.create({ name, email, phone, subject, message }).fetch();
      if (publicMessage) {

        await sails.helpers.contactUsEmail(type, name, phone, email, subject, message)

        return res.json({
          status: 'SUCCESS',
          message: 'Message sent successfully.',
        });

      }
      throw "Message could not be sent"
    } catch (error) {
      console.log(error);
      res.badRequest("Message could not be sent")
    }
  },
  privacyPolicyAndTerms: (req, res) => {
    res.view('privacy-policy-and-terms')
  },
  about: (req, res) => {
    res.view('about')
  },
  forgotPasswordView: (req, res) => {
    res.view("forgot-password")
  },

  forgotPassword: async (req, res) => {
    console.log('forgotPassword==>', req.body);
    const { email, type } = req.body;
    try {
      let user
      if (type == 'employer') {
        user = await Employer.findOne({ recruiterEmail: email });
      }
      if (type == 'candidate') {
        user = await Candidate.findOne({ email: email });

      }

      if (!user) {
        res.json({
          status: 'ERROR',
          message: 'User does not exist.',
        });
      }
      const token = jwt.sign({ id: user.id, type: type }, jwtSecret, { expiresIn: '1h' });
      if (type == 'employer') {

        await Employer.updateOne({ id: user.id }, { resetToken: token });
      }
      if (type == 'candidate') {
        await Candidate.updateOne({ id: user.id }, { resetToken: token });
      }
      res.json({
        status: 'SUCCESS',
        message: 'Password reset email sent successfully!',

      });
      const link = `http://${req.get('host')}/reset-password?token=${token}`
      await sails.helpers.sendPasswordEmail(email, link)
    } catch (error) {
      console.error(error, '=======> sendMailFunction error');

      if (error.response) {
        console.error(error.response.body);
      }

      res.json({
        status: 'ERROR',
        message: 'Error in sending reset password mail.Please contact support.',
      });
    }


  },
  resetPasswordView: async (req, res) => {
    console.log('resetPassword==>', req.param('token'));
    const resetToken = req.param('token');
    try {
      const tokenData = jwt.verify(resetToken, jwtSecret);
      let user
      if (tokenData.type == 'employer') {

        user = await Employer.findOne({ id: tokenData.id });
      } else {
        user = await Candidate.findOne({ id: tokenData.id });

      }
      if (user.resetToken === resetToken) {
        return res.view('reset-password', {
          layout: null,
          resetToken
        });
      } else {
        throw 'Invalid Session';
      }
    } catch (error) {
      console.log(error);
      return res.view('404.ejs', {
        layout: null,
      });
    }


  },
  resetPassword: async (req, res) => {
    console.log('resetPassword==>', req.body);
    const { resetToken, password } = req.body;
    try {
      const tokenData = jwt.verify(resetToken, jwtSecret);

      let user
      if (tokenData.type === 'employer') {
        user = await Employer.findOne({ id: tokenData.id });

      } else {
        user = await Candidate.findOne({ id: tokenData.id });

      }
      if (user.resetToken === resetToken) {
        let passwordUpdate
        if (tokenData.type === 'employer') {
          passwordUpdate = await Employer.updateOne({ id: user.id }, { password, resetToken: '' });
        } else {
          passwordUpdate = await Candidate.updateOne({ id: user.id }, { password, resetToken: '' });
        }
        if (!passwordUpdate) {
          throw 'Password not updated';
        }
      } else {
        throw 'Invalid Session';
      }

      return res.json({
        status: 'SUCCESS',
        message: `Password updated successfully.`,
      });

    } catch (error) {
      console.log(error);
      return res.json({
        status: 'ERROR',
        message: `Invalid Session.Couldn't update password`,
      });

    }
  },
  dbUpdate:async(req,res)=>{
    const skills =  await Skill.find()
    for (const skill of skills) {
      console.log(skill)
      await Skill.updateOne({name:skill.name},{searchKey:skill.name.toLowerCase()})
    }
  }
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

function objectToQueryString(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}