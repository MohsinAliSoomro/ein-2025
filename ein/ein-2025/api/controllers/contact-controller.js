// api/controllers/ContactController.js

module.exports = {

    // Renders the Contact Us page.
    viewContact: async function (req, res) {
      // You can pass any required locals to your view.
      // For example, you might pass default values or data from the session.
      return res.view('pages/contact', {
        userType: req.session.userType || '',
        name: req.session.name || '',
        email: req.session.email || '',
        phone: req.session.phone || ''
      });
    },
  
    // Handles the contact form submission.
    sendMessage: async function (req, res) {
      try {
        // Extract data from the form submission (assuming method="POST")
        var type    = req.body.type;
        var name    = req.body.name;
        var email   = req.body.email;
        var phone   = req.body.phone;
        var subject = req.body.subject;
        var message = req.body.message;
  
        // Here you might process the data:
        // e.g., save it to the database, send an email, etc.
        sails.log.info('Contact form submitted:', { type, name, email, phone, subject, message });
  
        // For now, we simply redirect back with a success flag.
        return res.redirect('/contact?success=true');
      } catch (err) {
        sails.log.error('Error processing contact form:', err);
        return res.serverError(err);
      }
    }
  
  };
  