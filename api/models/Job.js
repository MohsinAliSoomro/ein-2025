/**
 * Job.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    id: { type: 'string', columnName: '_id' },
    title: {
      type: 'string',
      required: true
    },
    company: {
      type: 'string',
    },
    description: {
      type: 'string',
      required: true
    },
    category: {
      type: 'string',
      required: true
    },
    image: {
      type: 'string',
      defaultsTo: '/images/job.png'
    },
    type: {
      type: 'ref',
      // isIn:['Contract','Part-Time','Full-Time','Temprorary','Freelancer'],
      // required: true
    },
    noticePeriod: {
      type: 'number',
    },
    experience: {
      type: 'number',

    },
    level: {
      isIn: ['Junior', 'Manager', 'Senior'],
      type: 'string'
    },
    jobLink: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    deadline: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    zip: {
      type: 'string',
    },
    status: {
      type: 'string',
      defaultsTo: 'Active',
      isIn: ['Active', 'Inactive'],
    },
    languages: {
      type: 'string',
      defaultsTo: 'Any',

    },
    jobNumber:{
      type: 'string'
    },
    workPlace:{
      type: 'string'
    },
    remoteWork:{
      type: 'string'
    },



    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    employerId: {
      model: "employer",
    },
    candidates: {
      collection: "candidate",
      via: 'jobId',
      through: 'JobCandidateMap'
    },
    appliedCandidates: {
      collection: "JobCandidateMap",
      via: 'jobId',
    },
    skills: {
      collection: "skill",
      via: 'jobs'
    },
    requiredSkill:{
      type: "json"
    }

  },


};

