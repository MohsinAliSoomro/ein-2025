/**
 * Candidate.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt');
module.exports = {

  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    id: { type: 'string', columnName: '_id' },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string',
    },
    gender: {
      type: 'string',
      isIn: ['Male', 'Female', 'Other'],
    },
    address: {
      type: 'string',

    },
    facebook: {
      type: 'string'
    },

    twitter: {
      type: 'string'
    },

    google: {
      type: 'string'
    },

    linkedIn: {
      type: 'string'
    },
    status: {
      type: 'string',
      defaultsTo: 'Active',
      isIn: ['Active', 'Hidden', 'Inactive'],

    },
    isVerified: {
      type: 'boolean',
      defaultsTo: false,
    },

    image: {
      type: 'string',
      defaultsTo: '/images/avatar.png'
    },

    aboutInfo: {
      type: 'string'
    },


    jobAlerts: {
      type: 'number',
      defaultsTo: 0
    },

    views: {
      type: 'number',
      defaultsTo: 0

    },
    resetToken: 'string',
    profileFor: {
      type: 'string',
      isIn: ['Self', 'Others']
    },

    // Settings


    tipsAndNews: {
      type: 'string',
      isIn: ['Subscribe', 'Unsubscribe'],
      defaultsTo: "Subscribe"
    },

    notificationFrequency: {
      type: 'string',
      isIn: ["Daily", "Weekly", "Monthly"],
      defaultsTo: "Daily"

    },
    visibility: {
      type: 'string',
      isIn: ['Visibile', 'Invisible for everyone'],
      defaultsTo: "Visible"
    },
    relocate: {
      type: "string"
    },

    isProfileCompleted: {
      type: 'boolean',
      defaultsTo: false,
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    resumeId: {
      model: 'resume'
    },
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    appliedJobs: {
      collection: "job",
      via: 'candidateId',
      through: 'JobCandidateMap'
    },
    educationList: {
      collection: "education",
      via: 'candidateId'
    },
    experienceList: {
      collection: "experience",
      via: 'candidateId'
    },
    skillList: {
      collection: "skill",
      via: 'candidateId',
      through: 'candidateSkillMap'
    },
    skills: {
      collection: "candidateSkillMap",
      via: 'candidateId',
    },
    otherLocationList: {
      collection: "OtherLocation",
      via: 'candidateId'
    },
    lastLogin: {
      type: 'string',
      columnType: 'date'
    },
    candidateNumber: {
      type: 'string',
      columnType: 'date'
    },
  },
  customToJSON: function () {
    return _.omit(this, ['password', 'resetToken']);
  },
  beforeCreate: async function (values, next) {
    values.password = await bcrypt.hash(values.password, 10);
    next();
  },
  beforeUpdate: async function (values, next) {
    if (values.password) {
      values.password = await bcrypt.hash(values.password, 10);
    }
    next();
  },
  cascadeOnDestroy: true
};

