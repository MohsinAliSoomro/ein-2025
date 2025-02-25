/**
 * HelloController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  homepage: function(req, res) {
    // Render the "homepage" view, typically located at views/pages/homepage.ejs
    return res.view('pages/homepage', {
      title: 'Welcome to My Sails App',
      message: 'Hello, world!'
    });
  }
};

