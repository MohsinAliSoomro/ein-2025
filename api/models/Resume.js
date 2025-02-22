/**
 * Resume.js
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
    professionalTitle: {
      type: 'string',
    },
    jobCategory: {
      type: 'string',
      // required: true
    },
    noticePeriod: {
      type: 'number',
    },
    aboutNotes: {
      type: 'string',
    },
    uploadedResume: {
      type: 'string',
    },
    // coverImage: {
    //   type: 'string',
    // },
    website: {
      type: 'string'
    },
    country: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    zip: {
      type: 'string',
    },
    employmentType: {
      type: 'ref'
    },

    willinglessToChange:{
      type: 'string',
      // isIn:[],

    },
    workAuthorization: {
      type: 'string'
    },
    resumeContent:{
      type: 'string'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    candidateId: {
      model: 'candidate'
    },
    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    experienceList: {
      collection: "experience",
      via: 'resumeId'
    },
    educationList: {
      collection: "education",
      via: 'resumeId'
    },
    skillList: {
      collection: "skill",
      via: 'resumeId',
      through: 'candidateSkillMap'
    }

  },
};

