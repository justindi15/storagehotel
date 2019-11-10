//Libraries
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded());

//Import routes
const userRoute = require('./routes/user');

//Routes
app.use('/users', userRoute);


//Connect to database (currently using a test database)
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
