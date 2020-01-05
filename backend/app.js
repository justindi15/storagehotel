//Libraries
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// //Import routes
const userRoute = require('./routes/user');

// //Routes
app.use('/users', userRoute);

require('./config/passport');

//Connect to database (currently using a test database)
//TODO: move url to env variable
const url = 'mongodb://127.0.0.1:27017/storagehotel'
mongoose.connect(url,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

//Check database connection
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

app.listen(port, () => console.log(`listening on port ${port}!`))
