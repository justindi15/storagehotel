var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }

      //Return if user is not activated yet
      if(!user.activated) { return done(null, false, {message: 'User has not been activated'})}

      user.comparePassword(password, function(err, isMatch){
        if (err) throw err;
        if(isMatch) return done(null, user); //If credentials are correct, return the user object
        if(!isMatch) return done(null, false, {message: 'Password is wrong'}); //otherwise, reject request
      })

    });
  }
));
