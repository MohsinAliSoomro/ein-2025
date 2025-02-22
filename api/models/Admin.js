/**
 * Admin.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require("bcrypt");
module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    id: { type: "string", required: true, unique: true },

    email: {
      type: "string",
      required: true,
      unique: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },
  customToJSON: function () {
    return _.omit(this, ["password", "resetToken"]);
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
  cascadeOnDestroy: true,
};
