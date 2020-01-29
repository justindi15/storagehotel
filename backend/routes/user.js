const express = require('express');
const stripe = require('stripe')('sk_test_aDaPbmZGVlLWSuLx5rVdKlFA');
var passport = require('passport');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
var nodemailer = require('nodemailer');
const uuidv4 = require('uuid/v4');

let mailOptions = function(email, activationToken){
    return {
        from: process.env.EMAIL,
        to: email,
        subject: 'Storagehotel Account Activation',
        text: 'Your activation token is ' + activationToken,
    }
}

router.get('/', (req, res) => {
    res.send('we are on users')
});

//Creates a customer on stripe and in the database
router.post('/register', (req, res) => {

  //TODO: validate form input types

  const {name, email, payment_method} = req.body;

  //check if user with email already exists
  User.findOne({ email: email}, (err, user) => {
    if (err) {res.status(400).json({ message: err})}
    if (user) {res.status(400).json({ message: "User with that email already exists"})}
    if (!user) {

        //create a stripe customer and attaches payment method in one API call
        stripe.customers.create({
            name: name,
            email: email,
            payment_method: payment_method,
            invoice_settings: {
                default_payment_method: payment_method,
              },
          }, function(err, customer){
              //send a failed response if stripe api call fails
              if(err) {res.status(400).json({ message: err})}

              //save user with stripe customer id to database if stripe call succeeds
              const newUser = new User({
                  name: customer.name,
                  email: customer.email,
                  stripe_id: customer.id,
                  activated: false,
                  activationToken: uuidv4(),
              })

              newUser.save()
              .then(stripe.subscriptions.create({
                    customer: customer.id,
                    items: [{ plan: 'plan_GYos3iNQoLNUNv', quantity: 5 }],
                    expand: ['latest_invoice.payment_intent']
                  }, function(err, subscription){
                        var token;
                        token = newUser.generateJwt();
                        var activationToken = newUser.activationToken;

                        //send activation email TODO: refactor this out
                        var transporter = nodemailer.createTransport({
                            host: 'smtp.zoho.com',
                            port: 465,
                            secure: true, // use SSL
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.PASSWORD,
                            }
                        });
                        
                        transporter.sendMail(mailOptions(email, activationToken), function (error, info) {
                          if (error) {
                              console.log(error);
                          } else {
                              console.log('Email sent: ' + info.response);
                          }
                        });

                        res.status(200);
                        res.json({"token": token, "subscription": subscription.status});
                  }))
              .catch(err => {res.status(400).json({ message: err})});
          });
    }
  })
});

//Activate a registered user
router.post('/activate', (req, res, next) => {

    const { email, password, activationToken } = req.body;

    //check if user exists
    User.findOne({ email: email}, (err, user) => {
        if (err) {res.status(400).json({ message: err})}
        if (!user) {res.status(400).json({ message: "User with that email does not exist"})}
        if (user) {
            //check if user account is already enabled
            if(user.activated){
                {res.status(400).json({ message: "This user account is already activated"})}
            }
            //if user exists, is not yet enabled, and the activation token matches, then add a salted password and activate it
            if((user.activated == false) && user.activationToken == activationToken){

                // generate a salt
                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if (err) {res.status(400).json({ message: err})}

                    // hash the password using our new salt
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {res.status(400).json({ message: err})}

                        // override the cleartext password with the hashed one
                        user.password = hash;
                        user.activated = true;
                        user.activationToken = undefined;
                        user.save().then(() => {
                            res.status(200);
                            res.json({ "message": "successfully activated account"})
                        })
                    });
                });
            }
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
