const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const validation = require('./joiValidation/joiValUser');
const userLimit = require('./userLimit')

// Check if autherized
const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('http://localhost:3000/');
    } else {
        next();
    }
};

// Google login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google login callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000?errEmail=*Email is already in use on this site', session: true }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3000/');
});

// Local login
router.post('/login', function(req, res) {
  passport.authenticate('local', function(err, user) {
    if (err) { throw (err); }
    if (!user) { return res.status(400).send(); }
    req.logIn(user, function(err) {
      if (err) { throw (err); }
      return res.status(200).send();
    });
  })(req, res);
});

function capitalizeTheFirstLetterOfEachWord(words) {
  var separateWord = words.toLowerCase().split(' ');
  for (var i = 0; i < separateWord.length; i++) {
     separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
     separateWord[i].substring(1);
  }
  return separateWord.join(' ');
}

// Local registeration
router.post('/register', async (req, res) => {

  // Check if input is valid
  let { error, value } = await validation.validateUser(req.body);
	if (error) return res.status(400).send({error: error});

  // Check if email is in use
  const emailCheck = await User.exists({email: req.body.email.toLowerCase()});
  if(emailCheck) return res.status(400).send({status: true, name: '', email: '*invalid email or password', password: ''});

  // Hash password
  const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create and save new user in database
  const newUser = new User({
    name: capitalizeTheFirstLetterOfEachWord(req.body.name),
    email: req.body.email.toLowerCase(),
    password: hashedPassword
  })

  newUser.save().then((newUser) => {
      userLimit();
      res.send('User Created Success') 
  }).catch((err) => res.send(err) );

  res.send('User Created Success')
});

router.get('/getuser', (req, res) => {
  res.send(req.user);
});

// End session
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('http://localhost:3000/');
});

module.exports = router;