var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

//Create a new user and save it to the database
module.exports.register = function(req, res) {

  //TODO: validate form input types

  const {name, email, password} = req.body;

  const newUser = new User({
      name: name,
      email: email,
      password: password
  });

  //TODO: check if user is already in database => don't register if already exists

  newUser.save()
  .then(function() {
    var token;
    token = newUser.generateJwt();
    res.status(200);
    res.json({"token": token});
  })
  .catch(err => {res.status(400).json({ message: err})});
}
