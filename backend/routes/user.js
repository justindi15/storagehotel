const express = require('express');
const stripe = require('stripe')('sk_test_aDaPbmZGVlLWSuLx5rVdKlFA');
var passport = require('passport');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
var nodemailer = require('nodemailer');
var jwt = require('express-jwt');
const uuidv4 = require('uuid/v4');
var auth = jwt({
    secret: process.env.PRIVATE_KEY,
    userProperty: 'payload'
  });
var mailOptions = ('emailOptions.js');

// let mailOptions = function(activationToken){
//     return {
//         from: process.env.EMAIL,
//         to: email,
//         subject: 'Storagehotel Account Activation',
//         text: 'Follow this link to finish creating your account ' 
//         + `http://localhost:4200/activate/${activationToken}`,
//     }
// }

router.get('/', (req, res) => {
    res.send('we are on users')
});

//Creates a customer on stripe and in the database
router.post('/register', (req, res) => {

  //TODO: validate form input types

  const {name, email, payment_method, address, subscriptions, startdate, phone } = req.body;
  const {line1, line2, city, postalcode} = address;
  
  //check if user with email already exists
  User.findOne({ email: email}, (err, user) => {
    if (err) {res.status(400).json({ message: err})}
    if (user) {res.status(400).json({ message: "User with that email already exists"})}
    if (!user) {

        //create a stripe customer and attaches payment method in one API call
        stripe.customers.create({
            name: name,
            email: email,
            phone: phone,
            address: {
                "line1": line1,
                "city": city,
                "country": "CA",
                "line2": line2,
                "postal_code": postalcode,
                "state": "BC",
            },
            payment_method: payment_method,
            invoice_settings: {
                default_payment_method: payment_method,
              },
          }, function(err, customer){
              //send a failed response if stripe api call fails
              if(err) {
                  console.log(err);
                  res.status(400).json({ message: "stripe api call failed"})
                }

              //save user with stripe customer id to database if stripe call succeeds
              const newUser = new User({
                  email: customer.email,
                  stripe_id: customer.id,
                  activated: false,
                  activationToken: uuidv4(),
              })

              newUser.save()
              .then(stripe.subscriptionSchedules.create({
                    customer: customer.id,
                    start_date: startdate,
                    phases: [
                        {
                            plans: subscriptions,
                            default_tax_rates: ['txr_1GEQ8iJ9qNaYrnZunLqjMhC1']
                        }

                    ]
                  }, function(err, subscription){
                    if(err) console.log(err);
                    if(subscription) console.log(subscription);
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
                        
                        transporter.sendMail(mailOptions(activationToken), function (error, info) {
                          if (error) {
                              console.log(error);
                          } else {
                              console.log('Email sent: ' + info.response);
                          }
                        });

                        res.status(200).json({"token": token, "subscription": subscription.status});
                  }))
              .catch(err => {res.status(400).json({ message: err})});
          });
    }
  })
});


router.post('/verifyEmail', (req, res, next) => {
    const { email } = req.body;
    console.log('verfied email: ' + email);

    User.findOne({ email: email}, (err, user) => {
        if (err) {res.status(400).json({ message: err})}
        if (!user) {res.status(400).json({ message: "User with that email does not exist"})}
        if (user) {
            if(user.activated){
                res.status(200).json({message: "success"})
            }else{
                {res.status(401).json({message: "You have not activated your account yet"})}
            }
        }
    })
});

//Activate a registered user
router.post('/activate', (req, res, next) => {

    const { password, activationToken } = req.body;

    //check if user exists
    User.findOne({ activationToken: activationToken}, (err, user) => {
        if (err) {res.status(400).json({ message: err})}
        if (!user) {res.status(400).json({ message: "User with that email does not exist"})}
        if (user) {
            //check if user account is already enabled
            if(user.activated){
                {res.status(400).json({ message: "This user account has already been activated"})}
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
                            res.status(200).json({ "message": "successfully activated account"})
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
            res.status(200).json({"token": token});
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res, next);

});

//add an appointment to a user
router.post('/appointment', (req, res, next) => {

    const { email, appointment} = req.body;

    User.findOne({ email: email}, (err, user)=>{
        if (err) {res.status(400).json({ message: err})}
        if (!user) {res.status(400).json({ message: "User with that email does not exist"})}
        if (user) {
            user.appointments.push(appointment);
            user.save().then(() => {
                res.status(200).json("Successfully added appointment");
            })
        }
    })
})

//remove an appointment from a user
//add an appointment to a user
router.post('/deleteappointment', (req, res, next) => {

    const { email, appointmentId } = req.body;

    User.updateOne(
        { email: email },
        { $pull: { appointments: { _id: appointmentId } } }
    ).then(() => {
        res.status(200).json("Successfully deleted appointment");
    }).catch(err => {
        console.log(err);
    })
})

router.get('/profile', auth, (req, res) => {
    if (!req.payload._id) {
        res.status(401).json({
          "message" : "UnauthorizedError: private profile"
        });
      } else {
        User
          .findOne({email: req.payload.email}, (err, user)=>{
            if (err) {res.status(400).json({ message: err})}
            stripe.customers.retrieve(
                user.stripe_id,
                function(err, customer) {
                    if (err) {res.status(400).json({ message: err})}
                    stripe.subscriptionSchedules.list(
                        {customer: user.stripe_id},
                        function(err, subscriptions){
                            if (err) {res.status(400).json({ message: err})}
                            let items = [];
                            subscriptions.data.forEach(subscription => {
                                subscription.phases.forEach(phase =>{
                                    phase.plans.forEach(plan =>{
                                        items.push({
                                            "plan_id": plan.plan,
                                            "quantity": plan.quantity,
                                            "status": subscription.status,
                                            "startdate": phase.start_date,
                                        })
                                    })
                                })
                            });
                            res.status(200).json({
                                "name": customer.name,
                                "phone": customer.phone,
                                "email": customer.email,
                                "address": customer.address,
                                "items": items,
                                "appointments": user.appointments
                            });
                        }
                    )
                }
              );
          })
      }
})

module.exports = router;
