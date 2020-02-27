const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

var Address = {line1: String, line2: String, city: String, postalcode: String}

const UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    name: { type: String, required: true},
    password: { type: String},
    stripe_id: { type: String, required: true},
    activated: { type: Boolean},
    activationToken: { type: String },
    appointments: [{items: [String], address: {line1: String, line2: String, city: String, postal_code: String}, date: String, time: String, appointmentType: String}],
    customItems: [{name: String, path: String, startdate: Date, status: String, price: Number}]
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
      items: this.item,
      address: this.address,
      stripe_id: this.stripe_id,
      exp: parseInt(expiry.getTime() / 1000),
    }, process.env.PRIVATE_KEY);
}

module.exports = mongoose.model('User', UserSchema);
