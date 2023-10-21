const router = require('express').Router();
const User = require('../models/User');

// Post request route that retrieves the form data (email, password) and creates a new user in the database using our User model
// The route will respond with a message of "User added successfully"
router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create(req.body);

    req.session.user_id = user.id;

    res.redirect('/');

  } catch (err) {
    console.log(err);
    // Set our session errors array to an array of just sequelize error message stings
    // req.session.errors = error.errors.map(err => err.message);
    res.redirect('/register');
  }

});

router.post('/login', async (req, res) => {
  
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });

  // User not found with the email address provided
  if (!user) {
    req.session.errors = ['No user found with that email address.'];

    return res.redirect('/login');
  }

  const passIsValid = await user.validatePass(req.body.password)

  // Check if password is Invalid
  if (!passIsValid) {
    req.session.errors = ['Password is incorrect.']

    return res.redirect('/login');
  }
  
  req.session.user_id = user.id;
  
  res.redirect('/');

});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

module.exports = router;