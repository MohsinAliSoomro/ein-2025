/**
 * PublicMessage.js
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

    name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true,
    },
    phone: {
      type: 'string',
      // required: true,
    },
    subject: {
      type: 'string',
      required: true,
    },
    message: {
      type: 'string',
      required: true,
    },

  },

};

