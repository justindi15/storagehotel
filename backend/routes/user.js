const express = require('express');
var passport = require('passport');
const router = express.Router();
const User = require('../models/user')

router.get('/', (req, res) => {
    res.send('we are on users')
});

//Create a new user and Save it to the database
router.post('/register', (req, res) => {

  //TODO: validate form input types

  const {name, email, password} = req.body;

  const newUser = new User({
      name: name,
      email: email,
      password: password
  });

  //TODO: check if user is already in database => don't register if already exists
  User.findOne({ email: email}, (err, user) => {
    if (err) {res.status(400).json({ message: err})}
    if (user) {res.status(400).json({ message: "User with that email already exists"})}
    if (!user) {
        newUser.save()
        .then(function() {
          var token;
          token = newUser.generateJwt();
          res.status(200);
          res.json({"token": token});
        })
        .catch(err => {res.status(400).json({ message: err})});
    }
  })
});

//Validate a Login Request
router.post('/login', (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res, next);

});

module.exports = router;
