const express = require('express');
const stripe = require('stripe')('sk_test_aDaPbmZGVlLWSuLx5rVdKlFA');
var passport = require('passport');
const router = express.Router();
const User = require('../models/user')

router.get('/', (req, res) => {
    res.send('we are on users')
});

//Creates a customer on stripe and in the database
router.post('/register', (req, res) => {

  //TODO: validate form input types

  const {name, email, password, payment_method} = req.body;

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
                  password: 'test', //TODO: handle registering without a password
                  stripe_id: customer.id,
              })

              newUser.save()
              .then(stripe.subscriptions.create({
                    customer: customer.id,
                    items: [{ plan: 'plan_GYos3iNQoLNUNv', quantity: 5 }],
                    expand: ['latest_invoice.payment_intent']
                  }, function(err, subscription){
                        var token;
                        token = newUser.generateJwt();
                        res.status(200);
                        res.json({"token": token, "subscription": subscription.status});
                  }))
              .catch(err => {res.status(400).json({ message: err})});
          });
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

router.get('/payment', (req, res, next)=> {
    const paymentId = stripe.paymentMethods.create(
        {
          type: 'card',
          card: {
            number: '4242424242424242',
            exp_month: 1,
            exp_year: 2021,
            cvc: '314',
          },
        }, function(err, paymentMethod){
            if(err) {res.status(400).json({ message: err})}
            res.json({
                "paymentId": paymentMethod.id
            })
        });
})

module.exports = router;
