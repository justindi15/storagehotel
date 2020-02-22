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
                        
                        transporter.sendMail(mailOptions(email, activationToken, name), function (error, info) {
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

let mailOptions = function(email, activationToken, name){
    return {
        from: process.env.EMAIL,
        to: email,
        subject: 'Storagehotel Account Activation',
        text: 'Follow this link to finish creating your account ' 
        + `http://localhost:4200/activate/${activationToken}`,
        html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'><meta name='viewport' content='width=device-width'><title>Activate Your Account | Storagehotel</title></head><body style='-moz-box-sizing:border-box;-ms-text-size-adjust:100%;-webkit-box-sizing:border-box;-webkit-text-size-adjust:100%;Margin:0;background:#f3f3f3!important;box-sizing:border-box;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important'><style>@media only screen{html{min-height:100%;background:#f3f3f3}}@media only screen and (max-width:596px){.small-float-center{margin:0 auto!important;float:none!important;text-align:center!important}.small-text-center{text-align:center!important}.small-text-left{text-align:left!important}.small-text-right{text-align:right!important}}@media only screen and (max-width:596px){.hide-for-large{display:block!important;width:auto!important;overflow:visible!important;max-height:none!important;font-size:inherit!important;line-height:inherit!important}}@media only screen and (max-width:596px){table.body table.container .hide-for-large,table.body table.container .row.hide-for-large{display:table!important;width:100%!important}}@media only screen and (max-width:596px){table.body table.container .callout-inner.hide-for-large{display:table-cell!important;width:100%!important}}@media only screen and (max-width:596px){table.body table.container .show-for-large{display:none!important;width:0;mso-hide:all;overflow:hidden}}@media only screen and (max-width:596px){table.body img{width:auto;height:auto}table.body center{min-width:0!important}table.body .container{width:95%!important}table.body .column,table.body .columns{height:auto!important;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;padding-left:16px!important;padding-right:16px!important}table.body .column .column,table.body .column .columns,table.body .columns .column,table.body .columns .columns{padding-left:0!important;padding-right:0!important}table.body .collapse .column,table.body .collapse .columns{padding-left:0!important;padding-right:0!important}td.small-1,th.small-1{display:inline-block!important;width:8.33333%!important}td.small-2,th.small-2{display:inline-block!important;width:16.66667%!important}td.small-3,th.small-3{display:inline-block!important;width:25%!important}td.small-4,th.small-4{display:inline-block!important;width:33.33333%!important}td.small-5,th.small-5{display:inline-block!important;width:41.66667%!important}td.small-6,th.small-6{display:inline-block!important;width:50%!important}td.small-7,th.small-7{display:inline-block!important;width:58.33333%!important}td.small-8,th.small-8{display:inline-block!important;width:66.66667%!important}td.small-9,th.small-9{display:inline-block!important;width:75%!important}td.small-10,th.small-10{display:inline-block!important;width:83.33333%!important}td.small-11,th.small-11{display:inline-block!important;width:91.66667%!important}td.small-12,th.small-12{display:inline-block!important;width:100%!important}.column td.small-12,.column th.small-12,.columns td.small-12,.columns th.small-12{display:block!important;width:100%!important}table.body td.small-offset-1,table.body th.small-offset-1{margin-left:8.33333%!important;Margin-left:8.33333%!important}table.body td.small-offset-2,table.body th.small-offset-2{margin-left:16.66667%!important;Margin-left:16.66667%!important}table.body td.small-offset-3,table.body th.small-offset-3{margin-left:25%!important;Margin-left:25%!important}table.body td.small-offset-4,table.body th.small-offset-4{margin-left:33.33333%!important;Margin-left:33.33333%!important}table.body td.small-offset-5,table.body th.small-offset-5{margin-left:41.66667%!important;Margin-left:41.66667%!important}table.body td.small-offset-6,table.body th.small-offset-6{margin-left:50%!important;Margin-left:50%!important}table.body td.small-offset-7,table.body th.small-offset-7{margin-left:58.33333%!important;Margin-left:58.33333%!important}table.body td.small-offset-8,table.body th.small-offset-8{margin-left:66.66667%!important;Margin-left:66.66667%!important}table.body td.small-offset-9,table.body th.small-offset-9{margin-left:75%!important;Margin-left:75%!important}table.body td.small-offset-10,table.body th.small-offset-10{margin-left:83.33333%!important;Margin-left:83.33333%!important}table.body td.small-offset-11,table.body th.small-offset-11{margin-left:91.66667%!important;Margin-left:91.66667%!important}table.body table.columns td.expander,table.body table.columns th.expander{display:none!important}table.body .right-text-pad,table.body .text-pad-right{padding-left:10px!important}table.body .left-text-pad,table.body .text-pad-left{padding-right:10px!important}table.menu{width:100%!important}table.menu td,table.menu th{width:auto!important;display:inline-block!important}table.menu.small-vertical td,table.menu.small-vertical th,table.menu.vertical td,table.menu.vertical th{display:block!important}table.menu[align=center]{width:auto!important}table.button.small-expand,table.button.small-expanded{width:100%!important}table.button.small-expand table,table.button.small-expanded table{width:100%}table.button.small-expand table a,table.button.small-expanded table a{text-align:center!important;width:100%!important;padding-left:0!important;padding-right:0!important}table.button.small-expand center,table.button.small-expanded center{min-width:0}}</style><table class='body' data-made-with-foundation='' style='Margin:0;background:#f3f3f3!important;border-collapse:collapse;border-spacing:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td class='float-center' align='center' valign='top' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0 auto;border-collapse:collapse!important;color:#0a0a0a;float:none;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:none;line-height:1.3;margin:0 auto;padding:0;text-align:center;vertical-align:top;word-wrap:break-word'><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='11px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:8px;font-weight:400;hyphens:none;line-height:8px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><center data-parsed='' style='min-width:580px;width:100%'><table align='center' class='container float-center' style='Margin:0 auto;background:#fefefe;border-collapse:collapse;border-radius:20px;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:480px'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:none;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='38px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:28px;font-weight:400;hyphens:none;line-height:28px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><table align='center' class='container' style='Margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;margin:0 auto;padding:0;text-align:inherit;vertical-align:top;width:480px'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:none;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'><table class='row' style='border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><th class='small-12 large-12 columns first last' style='Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:28px;padding-left:45px;padding-right:45px;text-align:left;width:564px'><table style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><th style='Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left'><center data-parsed='' style='min-width:0;width:100%'><img src='https://s3.ca-central-1.amazonaws.com/storagehotel.ca/assets/img/storagehotel-logo.png' alt='Storagehotel' align='center' class='float-center' height='38' style='-ms-interpolation-mode:bicubic;Margin:0 auto;clear:both;display:block;float:none;margin:0 auto;max-width:100%;outline:0;text-align:center;text-decoration:none;width:auto'></center></th><th class='expander' style='Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;visibility:hidden;width:0'></th></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table><table class='row' style='border-collapse:collapse;border-spacing:0;display:table;padding:0;position:relative;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><th class='small-12 large-12 columns first last' style='Margin:0 auto;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:28px;padding-left:45px;padding-right:45px;text-align:left;width:564px'><table style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><th style='Margin:0;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left'><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='11px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:400;hyphens:none;line-height:1.3;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><container><row><columns><h1 class='text-left' style='Margin:0;Margin-bottom:10px;color:inherit;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:600;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left;word-wrap:normal'>Hello ${name},</h1></columns></row></container><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='16px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:none;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><container><row><columns><p class='text-left' style='Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left'>Thank you for creating an account!</p></columns></row></container><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='8px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:8px;font-weight:400;hyphens:none;line-height:1.3;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><container><row><columns><p class='text-left' style='Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left'>Just one more step before you can manage your appointments and access your storage inventory.</p></columns></row></container><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='16px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:none;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><container><row><columns><p class='text-left' style='Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left'><i>Please click the link below to activate your account.</i></p></columns></row></container><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='16px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:none;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;padding-left:50px;padding-right:50px;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><table class='button rounded float-center' style='Margin:0 0 16px 0;border-collapse:collapse;border-spacing:0;float:none;margin:0 0 16px 0;padding:0;text-align:center;vertical-align:top;width:auto'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:none;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'><table style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;background:#E18A65;border:none;border-collapse:collapse!important;border-radius:500px;color:#fefefe;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:none;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'><a href='http://localhost:4200/activate/${activationToken}' style='Margin:0;border:0 solid #E18A65;border-radius:3px;color:#fefefe;display:inline-block;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;line-height:1.3;margin:0;padding:8px 18px 8px 18px;text-align:left;text-decoration:none'>Activate Your Account</a></td></tr></tbody></table></td></tr></tbody></table><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='11px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:1px;font-weight:400;hyphens:none;line-height:1.3;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><container><row><columns><p class='text-left' style='Margin:0;Margin-bottom:10px;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left'>If you have any questions, please reply to this email.</p></columns></row></container><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='16px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;hyphens:none;line-height:16px;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><container><row><columns><p class='text-center' style='Margin:0;Margin-bottom:10px;color:#0a0a0a;display:none;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center'>© 2020 Storagehotel<br>6163 University Boulevard, Vancouver, BC V6T 1Z1</p><p class='text-center' style='Margin:0;Margin-bottom:10px;color:#0a0a0a;display:none;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center'><small style='color:#cacaca;font-size:80%'><a href='#' style='Margin:0;color:#000;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none'>Manage Your Preferences</a></small></p></columns></row></container></th></tr></tbody></table></th></tr></tbody></table></td></tr></tbody></table></center></td></tr></tbody></table><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='18px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;hyphens:none;line-height:1.3;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><p class='text-center' style='Margin:0;Margin-bottom:10px;color:#999;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:400;letter-spacing:3px;line-height:16px;margin:0;margin-bottom:10px;padding:0;text-align:center'><a href='http://www.instagram.com/storagehotel' target='_blank' style='Margin:0;color:#999;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none'><i class='fa fa-lg fa-instagram'></i></a> <a href='http://www.facebook.com/storagehotel' target='_blank' style='Margin:0;color:#999;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none'><i class='fa fa-lg fa-facebook-square'></i></a> <a href='https://www.youtube.com/channel/UCOftKh6H3JXpUZyR6rFrbWA' target='_blank' style='Margin:0;color:#999;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none'><i class='fa fa-lg fa-youtube'></i></a> <a href='https://www.storagehotel.ca' target='_blank' style='Margin:0;color:#999;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none'><i class='fa fa-lg fa-link'></i></a> <a href='mailto:info@storagehotel.ca' style='Margin:0;color:#999;font-family:Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none'><i class='fa fa-lg fa-envelope-o'></i></a></p><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='8px' style='-moz-hyphens:none;-webkit-hyphens:none;Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:Helvetica,Arial,sans-serif;font-size:8px;font-weight:400;hyphens:none;line-height:1.3;margin:0;mso-line-height-rule:exactly;padding:0;text-align:left;vertical-align:top;word-wrap:break-word'></td></tr></tbody></table><p class='text-center' style='Margin:0;Margin-bottom:10px;color:#999;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:400;line-height:16px;margin:0;margin-bottom:10px;padding:0;text-align:center'>© 2020 Storagehotel<br>6163 University Boulevard, Vancouver, BC V6T 1Z1</p></body></html>`
    }
}

module.exports = router;
