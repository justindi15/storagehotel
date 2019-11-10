const express = require('express');
const router = express.Router();
const User = require('../models/user')

router.get('/', (req, res) => {
    res.send('we are on users')
});

//Create a new user and Save it to the database
router.post('/', (req, res) => {
    const {email, password} = req.body;

    const newUser = new User({
        email: email,
        password: password
    });

    newUser.save()
    .then(() => res.send('successfully created new user!'))
    .catch(err => {res.status(400).json({ message: err})});
});

module.exports = router;
