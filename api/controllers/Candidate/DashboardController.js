
module.exports = {
  dashboardView: async (req, res) => {

    const { candidateId } = req.session;
    // // } = req.allParams()
    // const query = req.param('query') || ''
    // const limit = req.param('limit') || 20
    // const city = req.param('city') || ''
    // const state = req.param('state') || ''
    // const category = req.param('category') || ''
    // let skills = req.param('skills')

    // const searchQuery = {
    //   category: category,
    //   city: { contains: city },
    //   state: { contains: state },
    //   or: [
    //     { title: { contains: query } },
    //     { title: { contains: toTitleCase(query) } },
    //     { company: { contains: query } },
    //     { company: { contains: toTitleCase(query) } },

    //   ]
    // }

    // let jobIds = []
    // if (skills) {
    //   skills = JSON.parse(skills)
    //   skills = await Skill.find({ name: skills }).populate('jobs', { select: 'id' })
    //   for (const skill of skills) {
    //     for (const job of skill.jobs) {
    //       if (!jobIds.includes(job.id)) {
    //         jobIds.push(job.id)
    //       }
    //     }
    //   }
    //   searchQuery.id = jobIds
    // }



    // let keyArray = ["city", "state", "category"]
    // for (const key of keyArray) {
    //   if (!searchQuery[key]) {
    //     delete searchQuery[key]
    //   }
    // }

    const jobList = await Job.find()
      .populate('employerId')
      .populate('skills');


    let candidate = await Candidate.findOne({ id: candidateId }).populate('appliedJobs', { select: 'id' })
    
    if(!(candidate && candidate.isProfileCompleted))
      return res.redirect('/candidate/my-resume');

    
    appliedJobIdList = candidate.appliedJobs.map(el => el.id)
    for (const job of jobList) {
      if (appliedJobIdList.includes(job.id)) {
        job.isApplied = true;
      } else {
        job.isApplied = false;

      }
      job.applied = await JobCandidateMap.count({ jobId: job.id })

    }



    const appliedJobs = await JobCandidateMap.count({ candidateId })
    const shortlisted = await JobCandidateMap.count({ candidateId, status: 'shortlisted' })

    const jobAlerts = 0
    const views = 0








    res.view('candidate/candidate-dashboard', { candidate, jobList, shortlisted, appliedJobs, jobAlerts, views });
  },
  profilePreview: async (req, res) => {
    const { candidateId } = req.session;
    const candidate = await Candidate.findOne({ id: candidateId })
      .populate('resumeId')
      .populate('skills')
      .populate('otherLocationList')
      .populate('educationList')
      .populate('experienceList')
      .populate('skills');
      console.log('---------------->', candidate);
    res.view('candidate/profile-preview', { candidate });
  },

  settingsView: async (req, res) => {
    const { candidateId } = req.session;
    const candidate = await Candidate.findOne({ id: candidateId })
    res.view('candidate/settings', { candidate })
  },
  settings: async (req, res) => {
    console.log('settingsUpdate', req.body)
    try {

      const { candidateId } = req.session;
      const { tipsAndNews, notificationFrequency, visibility, } = req.body;
      const candidate = await Candidate.updateOne({ id: candidateId }, { tipsAndNews, notificationFrequency, visibility, })
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Settings updated successfully',
      })
    } catch (error) {
      console.log(error)
      res.badRequest('Settings could not be updated.')
    }

  }
}

