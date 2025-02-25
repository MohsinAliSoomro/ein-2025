/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
 '/': { view:'index'},
  // "GET /": { controller: "PublicController", action: "homepageView" },
  // "GET /home": { controller: "PublicController", action: "newHomepageView" },
  // "GET /dbUpdate": { controller: "PublicController", action: "dbUpdate" },
  // "GET /contact": { controller: "PublicController", action: "contactPageView" },
  // "POST /contact": { controller: "PublicController", action: "publicMessage" },
  // "GET /search-jobs": { controller: "PublicController", action: "searchJobs" },
  // "GET /find-jobs": { controller: "PublicController", action: "findJobs" },
  // "GET /job-detail/:id": {
  //   controller: "PublicController",
  //   action: "jobDetail",
  // },
  // "GET /services": {
  //   controller: "PublicController",
  //   action: "servicespageView",
  // },

  // "GET /admin/login": { controller: "AdminController", action: "loginView" },
  // "POST /admin/login": { controller: "AdminController", action: "login" },
  // "GET /admin/dashboard": {
  //   controller: "AdminController",
  //   action: "dashboardView",
  // },
  // "GET /admin/candidate-management": {
  //   controller: "AdminController",
  //   action: "candidateManagement",
  // },
  // "GET /admin/employer-management": {
  //   controller: "AdminController",
  //   action: "employerManagement",
  // },
  // "GET /admin/message-management": {
  //   controller: "AdminController",
  //   action: "messageManagement",
  // },
  // "POST /admin/employer-status": {
  //   controller: "AdminController",
  //   action: "employerStatus",
  // },
  // "DELETE /admin/employer-delete": {
  //   controller: "AdminController",
  //   action: "employerDelete",
  // },
  // "DELETE /admin/candidate-delete": {
  //   controller: "AdminController",
  //   action: "candidateDelete",
  // },
  // "DELETE /admin/message-delete": {
  //   controller: "AdminController",
  //   action: "messageDelete",
  // },
  // "POST /admin/candidate-status": {
  //   controller: "AdminController",
  //   action: "candidateStatus",
  // },

  // "GET /candidate/signup": {
  //   controller: "CandidateController",
  //   action: "signupView",
  // },
  // "GET /candidate/login": {
  //   controller: "CandidateController",
  //   action: "loginView",
  // },
  // "POST /candidate/profile-update": {
  //   controller: "CandidateController",
  //   action: "profileUpdate",
  // },
  // "GET /candidate/my-profile": {
  //   controller: "CandidateController",
  //   action: "profileView",
  // },
  // "GET /candidate/my-resume": {
  //   controller: "CandidateController",
  //   action: "myResumeView",
  // },
  // "POST /candidate/signup": {
  //   controller: "CandidateController",
  //   action: "signup",
  // },
  // "POST /candidate/login": {
  //   controller: "CandidateController",
  //   action: "login",
  // },
  // "/candidate/google-login": {
  //   controller: "CandidateController",
  //   action: "googleLoginRedirect",
  // },
  // "GET /candidate/google": {
  //   controller: "CandidateController",
  //   action: "googleLogin",
  // },
  // "GET /candidate/facebook": {
  //   controller: "CandidateController",
  //   action: "facebookLogin",
  // },
  // "GET /candidate/facebook-redirect": {
  //   controller: "CandidateController",
  //   action: "facebookLoginRedirect",
  // },
  // "GET /verify-account": {
  //   controller: "CandidateController",
  //   action: "verifyAccount",
  // },
  // "GET /candidate/resend-verification-mail": {
  //   controller: "CandidateController",
  //   action: "resendVerificationEmail",
  // },
  // "GET /candidate/logout": {
  //   controller: "CandidateController",
  //   action: "logout",
  // },
  // "GET /candidate/job-details": {
  //   controller: "CandidateController",
  //   action: "jobDetails",
  // },

  // "POST /candidate/my-resume": {
  //   controller: "CandidateController",
  //   action: "resumeUpdate",
  // },
  // "POST /candidate/upload-resume": {
  //   controller: "CandidateController",
  //   action: "uploadResume",
  // },
  // "GET /candidate/browse-jobs-list": {
  //   controller: "CandidateController",
  //   action: "browseJobs",
  // },
  // "POST /candidate/job-apply": {
  //   controller: "CandidateController",
  //   action: "jobApply",
  // },
  // "POST /employer/job-apply": {
  //   controller: "EmployerController",
  //   action: "jobApply",
  // },
  // "POST /candidate/job-withdraw": {
  //   controller: "CandidateController",
  //   action: "jobWithdraw",
  // },
  // "PATCH /candidate/profile-image": {
  //   controller: "CandidateController",
  //   action: "profileImage",
  // },

  // "GET /candidate/dashboard": {
  //   controller: "Candidate/DashboardController",
  //   action: "dashboardView",
  // },
  // "GET /candidate/profile-preview": {
  //   controller: "Candidate/DashboardController",
  //   action: "profilePreview",
  // },
  // // 'GET /candidate/applied-jobs': { controller: 'Candidate/DashboardController', action: 'login' },
  // // 'GET /candidate/saved-jobs': { controller: 'Candidate/DashboardController', action: 'login' },
  // "GET /candidate/settings": {
  //   controller: "Candidate/DashboardController",
  //   action: "settingsView",
  // },
  // "POST /candidate/settings": {
  //   controller: "Candidate/DashboardController",
  //   action: "settings",
  // },

  // "GET /employer/signup": {
  //   controller: "EmployerController",
  //   action: "signupView",
  // },
  // "GET /employer/login": {
  //   controller: "EmployerController",
  //   action: "loginView",
  // },
  // "POST /employer/signup": {
  //   controller: "EmployerController",
  //   action: "signup",
  // },
  // "POST /employer/login": { controller: "EmployerController", action: "login" },
  // "GET /employer/dashboard": {
  //   controller: "EmployerController",
  //   action: "dashboardView",
  // },
  // "GET /employer/my-profile": {
  //   controller: "EmployerController",
  //   action: "profileView",
  // },
  // "POST /employer/profile-update": {
  //   controller: "EmployerController",
  //   action: "profileUpdate",
  // },
  // "GET /employer/post-new-job": {
  //   controller: "EmployerController",
  //   action: "postNewJobView",
  // },
  // "POST /employer/post-new-job": {
  //   controller: "EmployerController",
  //   action: "postNewJob",
  // },
  // "GET /employer/created-jobs": {
  //   controller: "EmployerController",
  //   action: "createdJobsView",
  // },
  // "DELETE /employer/job-delete": {
  //   controller: "EmployerController",
  //   action: "jobDelete",
  // },
  // "GET /employer/job-details": {
  //   controller: "EmployerController",
  //   action: "jobDetails",
  // },
  // "POST /employer/job-details": {
  //   controller: "EmployerController",
  //   action: "jobDetailsPost",
  // },
  // "PUT /employer/job-update": {
  //   controller: "EmployerController",
  //   action: "updateJob",
  // },
  // "PATCH /employer/job-status": {
  //   controller: "EmployerController",
  //   action: "jobStatus",
  // },
  // "PATCH /employer/profile-image": {
  //   controller: "EmployerController",
  //   action: "profileImage",
  // },
  // "GET /employer/browse-candidates": {
  //   controller: "EmployerController",
  //   action: "browseCandidates",
  // },
  // "GET /employer/settings": {
  //   controller: "EmployerController",
  //   action: "settings",
  // },
  // "GET /employer/resume": {
  //   controller: "EmployerController",
  //   action: "candidateResume",
  // },
  // "POST /employer/candidate-eligible-jobs": {
  //   controller: "EmployerController",
  //   action: "candidateEligibleJobs",
  // },
  // "GET /employer/support-us": {
  //   controller: "EmployerController",
  //   action: "supportUs",
  // },
  // "POST /employer/support-us": {
  //   controller: "EmployerController",
  //   action: "submitSupportUs",
  // },

  // "GET /forgot-password": {
  //   controller: "PublicController",
  //   action: "forgotPasswordView",
  // },
  // "GET /reset-password": {
  //   controller: "PublicController",
  //   action: "resetPasswordView",
  // },
  // "POST /forgot-password": {
  //   controller: "PublicController",
  //   action: "forgotPassword",
  // },
  // "POST /reset-password": {
  //   controller: "PublicController",
  //   action: "resetPassword",
  // },
  // "GET /privacy-policy-and-terms": {
  //   controller: "PublicController",
  //   action: "privacyPolicyAndTerms",
  // },
  // "GET /about": { controller: "PublicController", action: "about" },

  // "GET /employer/logout": {
  //   controller: "EmployerController",
  //   action: "logout",
  // },
};
