const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, index: { unique: true } },
    password: { type: String},
    stripe_id: { type: String, required: true},
    activated: { type: Boolean},
    activationToken: { type: String }, //TODO: handle activation token
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

UserSchema.methods.generateJwt =  function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
  
    return jwt.sign({
      _id: this._id,
      email: this.email,
      name: this.name,
      stripe_id: this.stripe_id,
      exp: parseInt(expiry.getTime() / 1000),
    }, process.env.PRIVATE_KEY);
}

module.exports = mongoose.model('User', UserSchema);
