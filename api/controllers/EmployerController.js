const passport = require('passport');
const moment = require('moment');
const { flash } = require('express-flash-message');

module.exports = {

  signupView: (req, res) => {
    res.view('employer/employer-signup');
  },
  loginView: (req, res) => {
    res.view('employer/employer-login');
  },
  signup: async (req, res) => {
    console.log('employer signup ==>', req.body);
    try {
      const employer = await Employer.create({ ...req.body }).fetch();
      if (employer) {
        console.log('=========employer => ', employer)
        //===
        const packages = await EmployerPackage.create({
          employerId: employer.id, 
          planType: 'default',
          plan: { resumeAccess: sails.config.custom.defaultResumes, jobPost: sails.config.custom.defaultJobs },
          packageDate: new Date(),
          status:true
        }).fetch()
        console.log('============packages =>', packages)
        res.status(200).json({
          status: 'SUCCESS',
          message: 'Sign up successful.'
        })
      }
    } catch (error) {
      console.log(error)
      if (error.code === 'E_UNIQUE') {
        return res.badRequest('Email already registered.')

      }
      res.badRequest('Something Went Wrong.')
    }
  },
  login: function (req, res) {
    console.log('employer login ==>', req.body);
    passport.authenticate('EmployerLogin', async (err, employer, info) => {
      if (err) {
        return res.badRequest('Something Went Wrong.')
      }
      if (!employer) {
        return res.badRequest(info.message)

      }

      console.log('############', employer, employer.id)

      // req.session.lastName = employer.lastName;
      let redirectUrl
      // if (!employer.gender) {
      //   redirectUrl = 'profile'
      // }
      // else
      // if (!employer.resumeId) {
      //   redirectUrl = 'create-job'
      // }
      // else {
      redirectUrl = 'dashboard'
      // }
      if (req.session.redirectUrl && req.session.redirectUrl.includes()) {
        redirectUrl = req.session.redirectUrl
      }
      console.log(req.session, '=========>')
      await Employer.updateOne({ id: req.session.employerId }, { lastLogin: new Date() })

      res.status(200).json({
        status: 'SUCCESS',
        message: info.message,
        redirectUrl
      })


    })(req, res);
  },
  dashboardView: async (req, res) => {
    const { employerId } = req.session
    const employer = await Employer.findOne({ id: employerId }).populate('jobs', { select: ['id', 'status'] })
    const jobList = await Job.find({ employerId }).populate('skills')
    for (const job of jobList) {
      job.shortListed = await JobCandidateMap.count({ jobId: job.id, status: 'shortlisted' })
      job.applied = await JobCandidateMap.count({ jobId: job.id })
    }
    res.view('employer/employer-dashboard', { employer, jobList })
  },
  supportUs: async (req, res) => {
    const { employerId } = req.session
    const employer = await Employer.findOne({ id: employerId }).populate('jobs', { select: ['id', 'status'] })
    const jobList = await Job.find({ employerId }).populate('skills')
    for (const job of jobList) {
      job.shortListed = await JobCandidateMap.count({ jobId: job.id, status: 'shortlisted' })
      job.applied = await JobCandidateMap.count({ jobId: job.id })
    }
    res.view('employer/employer-support-us', { employer, jobList })
  },
  submitSupportUs: async (req, res) => {
    const { employerId } = req.session
    console.log("submitSupportUs", req.body);
    let { subject, message, other = '' } = req.body;

    const employer = await Employer.findOne({ id: employerId })
    console.log('--------', employer);
    let jobNumber = '';
    if(subject == 'Can’t find resources for job, need EIN Support for Sourcing'){
      subject = subject + (other ? ` - ${other}` : '' );
      jobNumber = other ? `<br/>Job Number: ${other}<br/>` : '';
    }
    else if(subject == 'Others'){
      jobNumber = other ? `<br/>Other: ${other}<br/>` : '';
    }
      
    const { recruiterName, recruiterEmail, company, phone='' } = employer;
    const name = recruiterName;
    const email = recruiterEmail;
    try {

      const publicMessage = await PublicMessage.create({ name, email, phone, subject, message }).fetch();
      if (publicMessage) {

        await sails.helpers.supportEmail(name, company, phone, email, subject, message, jobNumber)

        return res.json({
          status: 'SUCCESS',
          message: 'Message sent successfully.'
        });

      }
      throw "Message could not be sent"
    } catch (error) {
      console.log(error);
      res.badRequest("Message could not be sent")
    }
  },
  postNewJobView: async (req, res) => {
    const { employerId } = req.session
    console.log('req.session => ',req.session)
    const employer = await Employer.findOne({ id: employerId })
    const skillList = await Skill.find({})
    const totalJob = await Job.count({ employerId, status: 'Active' });
    const employerPackage = await EmployerPackage.findOne({employerId, status:true});
    console.log(employerPackage)
    let jobCount = 0;
    if(employerPackage){
      jobCount = employerPackage.plan && employerPackage.plan.jobPost || 0;
    }
    if(totalJob >= jobCount){
      await req.addFlash({ messages: 'Your job post limit exceed Kindly remove existing one.'})
      res.redirect('/employer/created-jobs');
    } else {
      const questions = await Questions.find({status:true});
      res.view('employer/post-new-job', { employer, skillList, questions })
    }
  },
  profileView: async (req, res) => {
    const { employerId } = req.session
    const employer = await Employer.findOne({ id: employerId })
    // console.log(employer)
    res.view('employer/employer-profile', { employer });
  },

  profileUpdate: async (req, res) => {
    console.log('employer edit ==>', req.body);
    const { id } = req.body
    try {
      const employer = await Employer.updateOne({ id }, { ...req.body });
      if (employer) {
        res.status(200).json({
          status: 'SUCCESS',
          message: 'Updated successfully.'
        })
      }
    } catch (error) {
      console.log(error)
      if (error.code === 'E_UNIQUE') {
        return res.badRequest('Email already exists.')

      }
      res.badRequest('Something Went Wrong.')
    }
  },

  updateJob: async (req, res) => {
    console.log("updateJob", req.body)
    const { id } = req.body

    const job = await Job.updateOne({ id }, { ...req.body })

    if (job) {
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Job updated successfully.'
      })

    } else {
      res.badRequest('Job could not be posted.')
    }
  },
  postNewJob: async (req, res) => {
    const jobNumPrefix = 'EINJB';
    console.log("postNewJob", req.body)
    const { employerId, company, recruiterEmail, recruiterName } = req.session

    const totalJob = await Job.count({ employerId, status: 'Active' });
    const employerPackage = await EmployerPackage.findOne({employerId, status: true});
    console.log(employerPackage)
    let jobCount = 0;
    if(employerPackage){
      jobCount = employerPackage.plan && employerPackage.plan.jobPost || 0;
    }
    if(totalJob >= jobCount){
      await req.addFlash({ messages: 'Your job post limit exceed Kindly remove existing one.'})
      res.redirect('/employer/created-jobs');
    }

    const { image = '', email = '' } = req.body
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@ skillsData', req.body.skillsData)
    const skills  = req.body.skillsData ? JSON.parse(req.body.skillsData):[];
    // console.log('@@@@@@@@@@@@@@@@@@@@@@@@@ skills', skills)
    req.body.skills = skills.map(el => el.name);

    delete req.body.image
    // req.body.skills = skills.split(',')
    let skillListDb = await Skill.find()
    skillListDb = skillListDb.map(el => el.name)
    const promises = skills.map(async (skill) => {
      if (!skillListDb.includes(skill.name)) {
        return await Skill.create({ name: skill.name, searchKey: skill.name.toLowerCase()})
      }
    })
    await Promise.all(promises)

    const requiredSkill = skills;

    const checkUniqueId = async () => {
      let id = '';
      do {
          id = `${jobNumPrefix}${ new Date().getTime() }`;
   
      } while (await checkInDb(id));
      return id;
    }
    const checkInDb = async (id)=> {
      try {
          let jobFound = await Job.findOne({ jobNumber: id });
          if (jobFound) return true;
          else return false;
      }
      catch (err) {
          console.log(err);
          return false;
      }
    }

    try {
      if(email == ''){
        req.body.email = recruiterEmail;
      }
      const jobNumber = await checkUniqueId();
      const job = await Job.create({ ...req.body, employerId, company, jobNumber, requiredSkill }).fetch()

      if (job) {
        const questions  = req.body.questions ? JSON.parse(req.body.questions):[];
        const quePromises = questions.map(async (param) => {
            return await EmployerQuestion.create({ 
              question: param.question, 
              questionId: param.questionId || "",
              jobId: job.id,
              employerId
            })
        })
        await Promise.all(quePromises)

        res.status(200).json({
          status: 'SUCCESS',
          message: 'Posted successfully.'
        })
      
        let imageFile
        if (image !== '') {

          imageFile = new Promise((resolve, reject) => {
            req.file(`image`).upload(
              {
                dirname: "../../assets/images/",
                saveAs: job.id
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
          const uploadedProfileImage = await imageFile
          imageFile = uploadedProfileImage.fd.split('assets')[1].replace(/\\/g, '/')
          await Job.updateOne({ id: job.id }, { image: imageFile });
        }

      } else {
        res.badRequest('Job could not be posted.')
      }

    } catch (error) {
      console.log(error)
      res.badRequest("unique error")
    }
  },

  createdJobsView: async (req, res) => {
    const { employerId } = req.session
    const employer = await Employer.findOne({ id: employerId })
    const jobList = await Job.find({ employerId }).populate('skills')
    for (const job of jobList) {
      job.shortListed = await JobCandidateMap.count({ jobId: job.id, status: 'shortlisted' })
      job.applied = await JobCandidateMap.count({ jobId: job.id })
    }
    const skillList = await Skill.find()
    res.view('employer/created-jobs', { employer, jobList, skillList });
  },
  jobDetails: async (req, res) => {
    const id = req.param('id')
    if (!id) {
      res.view('404')
    }
    const { employerId, recruiterEmail, recruiterName } = req.session
    const job = await Job.findOne({ id, employerId })
      .populate('skills')
      if(!job){
      res.view('404')

      }
    // .populate('candidates')
    // .populate('appliedCandidates')
    const candidates = await JobCandidateMap.find({ jobId: id, status: { '!=': 'notInterested' } })
      .populate('candidateId')
    for (const candidate of candidates) {
      candidate.resume = await Resume.findOne({ candidateId: candidate.candidateId.id }).populate('skillList', { select: 'name' })
    }
    console.log('============job, candidates =>', job, candidates);
    res.view('employer/job-details', { job, candidates, recruiterEmail, recruiterName })
  },
  jobDetailsPost: async (req, res) => {
    console.log("jobDetailsPost==>", req.body)
    const { jobId } = req.body
    try {

      if (!jobId) {
        res.view('404')
      }
      const job = await Job.findOne({ id: jobId })
        .populate('skills')
      // .populate('candidates')
      // .populate('appliedCandidates')
      if (job) {
        res.json({
          status: 'success',
          message: 'Job details fetched successfully.',
          data: job,
        })

      } else {
        res.badRequest('Job not found.')
      }
    } catch (error) {
      console.log(error)
      res.badRequest('Job not found.')
    }

  },

  jobDelete: async (req, res) => {
    console.log('jobDelete==>', req.param('jobId'))
    const { employerId } = req.session
    const id = req.param('jobId')
    if (!id) {
      return res.badRequest('No job id provided')
    }
    const jobDelete = await Job.destroyOne({ id })
    if (jobDelete) {

      // const employerPackage = await EmployerPackage.findOne({employerId, status:true});
      // if(employerPackage){
      //   let jobCount = employerPackage.plan && employerPackage.plan.jobPost || 0;
      //   employerPackage.plan.jobPost = jobCount > 0 ? (parseInt(jobCount) - 1) : 0;
      //   let q = await EmployerPackage.updateOne({employerId, status: true}, {plan : employerPackage.plan });
      // }

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Job deleted successfully.'
      })
    }
  },
  jobStatus: async (req, res) => {
    console.log('jobStatus==>', req.body)
    try {


      const { jobId, candidateId, status } = req.body
      if (!jobId || !candidateId || !status) {
        return res.badRequest('Missing parameters')
      }
      const jobStatus = await JobCandidateMap.updateOne({ jobId, candidateId }, { status })

      if (jobStatus) {

        res.status(200).json({
          status: 'SUCCESS',
          message: 'Candidate status updated successfully.'
        })
        await sails.helpers.sendStatusEmail(candidateId, jobId, status)
      }
    } catch (error) {
      console.log(error)
      res.badRequest('Candidate status could not be updated.')
    }
  },

  browseCandidates: async (req, res) => {
    const { employerId } = req.session
    console.log('browseCandidates', req.allParams())
    const { query = '', state = '', city = '', zip = '', skills } = req.allParams()


    const searchQuery = {
      city: { contains: city },
      state: { contains: state },
      zip: { contains: zip },
      or: [
        { professionalTitle: { contains: query } },
        { professionalTitle: { contains: toTitleCase(query) } },

      ]
    }
    
    if (skills) {
      const skillIdList = JSON.parse(skills);
      // console.log('skillIdList ==========>', skillIdList)
      // if(query){
      //   skillIdList.push(query);
      // }
      // console.log('skillIdList ==========>', skillIdList)
      const candidateMapList = await CandidateSkillMap.find({ skillId: skillIdList })
      searchQuery.id = []
      for (const element of candidateMapList) {//unique resumes
        if (!searchQuery.id.includes(element.resumeId)) {
          searchQuery.id.push(element.resumeId)
        }
      }
    }
    let keyArray = ["city", "state", "jobCategory", "zip"]
    for (const key of keyArray) {
      if (!searchQuery[key]) {
        delete searchQuery[key]
      }
    }
    console.log('Query ', searchQuery )
    const resumeList = await Resume.find({ ...searchQuery }).select(['id'])

    const candidateList = await Candidate.find({ where: { visibility: { '!=': 'Invisible for everyone' }, resumeId: resumeList.map(el => el.id) } })
      .populate('resumeId')
      .populate('skillList')
    const skillList = await Skill.find()
    const jobList = await Job.find({ employerId }).populate('skills')
    res.view("employer/browse-candidates", { candidateList, skillList, jobList });
  },
  profileImage: async (req, res) => {
    console.log("profileImage==>")
    const { employerId } = req.session
    try {

      const imageFile = new Promise((resolve, reject) => {
        req.file(`image`).upload(
          {
            dirname: "../../assets/images/",
            saveAs: employerId + "-profile-image"
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
      const imageObject = await imageFile
      if (imageObject) {
        const image = imageObject.fd.split('assets')[1].replace(/\\/g, '/')
        await Employer.updateOne({ id: employerId }, { image })
        req.session.image = `${image}?${Math.random()}`
        res.status(200).json({
          status: 'SUCCESS',
          message: 'Employer image updated successfully.'
        })
      } else {
        res.badRequest('Something went wrong.')
      }
    } catch (error) {
      console.log(error)
      res.badRequest('Employer image could not be updated .')
    }
  },
  settings: async (req, res) => {
    const { employerId } = req.session
    const employer = await Employer.findOne({ id: employerId })
    res.view('employer/settings', { employer })
  },

  logout: function (req, res) {
    console.log('LOGOUT');
    req.session.destroy();
    res.redirect('/');
  },

  candidateResume: async (req, res) => {
    const { employerId } = req.session
    const candidateId = req.param('candidateId');
    const totCandidate = await EmployerCandidate.count({candidateId, employerId, status: true});
    if(totCandidate == 0){

      const employerPackage = await EmployerPackage.findOne({employerId, status:true});
      console.log(employerPackage)

      if(employerPackage){
        let candidateCount = employerPackage.plan && employerPackage.plan.resumeAccess || 0;
        let packageDate = employerPackage.packageDate;
        let monthDiff = parseInt(moment().diff(moment(packageDate, 'YYYY-MM-DD'), 'months', true));
        let packageStartDate = moment(packageDate, 'YYYY-MM-DD').add(monthDiff,'months').format();
        let packageEndDate = moment(packageStartDate, 'YYYY-MM-DD').add(1,'months').format();
        console.log('------------', packageStartDate, packageEndDate)
        const employerCandidate = await EmployerCandidate.count({
          employerId, 
          status: true,
          appliedAt:{
            '>=': packageStartDate,
            '<=': packageEndDate
          }
        });
        if(employerCandidate >= candidateCount){
          await req.addFlash({ messages: 'Your candidate adding limit exceed for this month.'})
          res.redirect('/employer/browse-candidates');
        }
      }
      await EmployerCandidate.create({candidateId, employerId, status: true, appliedAt: (new Date())});
    }

    const candidate = await Candidate.findOne({ id: candidateId })
      .populate('resumeId')
      .populate('skills')
      .populate('educationList')
      .populate('experienceList'
      ).populate('skills');
    res.view('candidate/profile-preview', { candidate });
  },

  jobApply: async (req, res) => {
    console.log('jobApply==>', req.body)
    try {
      const { jobId, candidateId } = req.body;
      const { employerId } = req.session
      const candidate = await EmployerCandidate.count({candidateId, employerId, status: true});
      if(candidate == 0){
        const employerPackage = await EmployerPackage.findOne({employerId, status:true});
        console.log(employerPackage)
        if(employerPackage){
          let candidateCount = employerPackage.plan && employerPackage.plan.resumeAccess || 0;
          let packageDate = employerPackage.packageDate;
          let monthDiff = parseInt(moment().diff(moment(packageDate, 'YYYY-MM-DD'), 'months', true)) + 1;
          let packageStartDate = moment(packageDate, 'YYYY-MM-DD').add(monthDiff,'months').format();
          let packageEndDate = moment(packageStartDate, 'YYYY-MM-DD').add(1,'months').format();
          console.log('------------', packageStartDate, packageEndDate)
          const employerCandidate = await EmployerCandidate.count({
            employerId, 
            status: true,
            appliedAt:{
              '>=': packageStartDate,
              '<=': packageEndDate
            }
          });
          if(employerCandidate >= candidateCount){
            await req.addFlash({ messages: 'Your candidate adding limit exceed for this month.'})
            res.redirect('/employer/browse-candidates');
          }
        }
        await EmployerCandidate.create({candidateId, employerId, status: true, appliedAt: (new Date()).getDate()});
      }

      await Candidate.addToCollection(candidateId, 'appliedJobs', jobId);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Applied successfully',
      })
    } catch (error) {
      console.log(error)
      res.badRequest("Couldn't apply.Please try again later.")
    }
  },
  candidateEligibleJobs: async (req, res) => {
    console.log("candidateEligibleJobs==>", req.body)
    const { candidateId } = req.body
    const { employerId } = req.session

    try {
      let candidateJobsList = await JobCandidateMap.find({ candidateId }).select('jobId')
      candidateJobsList = candidateJobsList.map(el => el.jobId)
      console.log({ candidateJobsList })
      const eligibleJobList = await Job.find({ employerId, id: { "!=": candidateJobsList } })
      res.json({
        data: eligibleJobList
      })
    } catch (error) {
      res.badRequest("Could not fetch eligible jobs for the candidate")
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
