/**
 * Skill.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {
  primaryKey: 'name',
  dontUseObjectIds: true,
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
      type: 'string',
      columnName:'_id',
      required: true,
    },
    searchKey:{
      type: 'string',
      // required:true
    },
    experienceYear:{
      type: 'string',
      // required:true
    },

    // percentage:{
    //   type: 'string',
    // },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // candidateId: {
    //   model: 'candidate'
    // },
    // resumeId: {
    //   model: 'resume'
    // },
    candidates:{
      collection: 'candidate',
      via:'skillId',
      through: 'candidateSkillMap',
    },
    resumeList:{
      collection: 'resume',
      via:'skillId',
      through: 'candidateSkillMap',
    },
    jobs:{
      collection: 'job',
      via:'skills'
    }

  },


};

