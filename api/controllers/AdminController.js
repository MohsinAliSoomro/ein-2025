const bcrypt = require('bcrypt');

module.exports = {
  loginView: (req, res) => {
    res.render('admin/admin-login', {});
  },
  dashboardView: async (req, res) => {
    const jobCount = await Job.count({ status: 'Active' });
    const candidateCount = await Candidate.count();
    const employerCount = await Employer.count();
    res.render('admin/admin-dashboard', { jobCount, candidateCount, employerCount });
  },
  login: async (req, res) => {
    console.log("admin login", req.body);

    try {
      const { email, password } = req.body;
      if (!email || !password) return res.badRequest('Bad Request');
      // const adminUser = email === 'admin@ein.com' && password === '3In@dmin'
      const adminUser = await Admin.findOne({ email: email });
      if (!adminUser) return res.badRequest('Invalid Credentials');
      const match = await bcrypt.compare(password, adminUser.password);
      console.log(match);
      if (match) {
        req.session.role = "admin";
      } else {
        return res.badRequest('Invalid Credentials');
      }
      res.json({
        status: 'SUCCESS',
        message: 'Logged in successfully',
      });
    } catch (err) {
      console.log(err)
      return res.badRequest('Invalid Credentials');

    }
  },
  candidateManagement: async (req, res) => {
    const candidateList = await Candidate.find().populate('appliedJobs')
    res.view('admin/candidate/manage-candidate', { candidateList })
  },
  employerManagement: async (req, res) => {
    const employerList = await Employer.find().populate('jobs')
    res.view('admin/employer/manage-employer', { employerList })
  },
  messageManagement: async (req, res) => {
    const messageList = await PublicMessage.find()
    res.view('admin/message-management', { messageList })
  },
  employerStatus: async (req, res) => {
    console.log('employer edit ==>', req.body);
    const { id, status } = req.body
    try {
      const employer = await Employer.updateOne({ id }, { id, status });
      if (employer) {
        res.status(200).json({
          status: 'SUCCESS',
          message: 'Status updated successfully.'
        })
      }
    } catch (error) {
      console.error(error)
      res.badRequest('Something Went Wrong.')
    }
  },
  candidateStatus: async (req, res) => {
    console.log('candidate edit ==>', req.body);
    const { id, status } = req.body
    try {
      const candidate = await Candidate.updateOne({ id }, { id, status });
      if (candidate) {
        res.status(200).json({
          status: 'SUCCESS',
          message: 'Status updated successfully.'
        })
      }
    } catch (error) {
      console.error(error)
      res.badRequest('Something Went Wrong.')
    }
  },
  employerDelete: async (req, res) => {
    console.log('employerDelete==>', req.param('employerId'))
    const id = req.param('employerId')
    if (!id) {
      return res.badRequest('No employer id provided')
    }
    const employerDelete = await Employer.destroyOne({ id })
    if (employerDelete) {
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Employer deleted successfully.'
      })
    }
  },
  candidateDelete: async (req, res) => {
    console.log('candidateDelete==>', req.param('candidateId'))
    const id = req.param('candidateId')
    if (!id) {
      return res.badRequest('No candidate id provided')
    }
    const candidateDelete = await Candidate.destroyOne({ id })
    if (candidateDelete) {
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Candidate deleted successfully.'
      })
    }
  },
  messageDelete: async (req, res) => {
    console.log('messageDelete==>', req.param('messageId'))
    const id = req.param('messageId')
    if (!id) {
      return res.badRequest('No message id provided')
    }
    const messageDelete = await PublicMessage.destroyOne({ id })
    if (messageDelete) {
      return res.status(200).json({
        status: 'SUCCESS',
        message: 'Message deleted successfully.'
      })
    }
    return res.badRequest('No message id provided')


  },





}
