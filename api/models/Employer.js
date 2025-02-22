/**
 * Employer.js
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

    recruiterName: {
      type: 'string',
      required: true
    },
    recruiterEmail: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string'
    },
    address1: {
      type: 'string',
    },
    address2: {
      type: 'string',
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
    status: {
      type: 'string',
      defaultsTo: 'Active',
      isIn: ['Active', 'Inactive'],

    },

    image: {
      type: 'string',
      defaultsTo: '/images/avatar.png'
    },
    company: {
      type: 'string'
    },
    companyWebsite: {
      type: 'string'
    },
    companyOwnerName: {
      type: 'string'
    },
    companyOwnerEmail: {
      type: 'string'
    },
    about: {
      type: 'string'
    },
    resetToken: 'string',


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝


    jobs: {
      collection: "job",
      via: 'employerId'
    },
    lastLogin: {
      type: 'string',
      columnType: 'date'
    }
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

