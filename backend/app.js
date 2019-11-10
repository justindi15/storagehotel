const express = require('express')
const mongoose = require('mongoose');

const app = express()
const port = 3000

//ROUTES
app.get('/', (req, res) => res.send('Hello World!'))

//CONNECT TO DATABASE (currently using a test database)
const url = 'mongodb://127.0.0.1:27017/storagehotel'
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true,});

//CHECK DATABASE CONNECTION
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

app.listen(port, () => console.log(`listening on port ${port}!`))
