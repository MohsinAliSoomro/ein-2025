// api/controllers/AuthController.js
module.exports = {
    login: function(req, res) {
      return res.view('pages/login', {
        // Pass any local variables to your view if needed:
        pageTitle: 'Login'
      });
    }
  };
  