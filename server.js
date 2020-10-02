const express = require('express');  //
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
const Customer = require('./models/userModel')
const customerRoutes = require('./routes/customerRoutes.js');
const vehicleRoutes = require('./routes/vehicleRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const extrasRoutes = require('./routes/extrasRoutes.js');
const cors = require('cors')

//use express framework
const app = express();
//use cors for cross origin resource sharing
app.use(cors())

//to handle POST requests in express ; extracts body of POST request to req.body
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//set the port for listen
const PORT = process.env.PORT || 3001;

//define mongodb connection via mongoose client
mongoose
.connect('mongodb://localhost:27017/mydb',{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex :true})
.then(() => {
  mongoose.set('useFindAndModify', false);
  console.log('Connected to the Database successfully');
})
.catch (error => console.error("Could not connect",error))

//routes for receiving requests from front end
app.use('/', customerRoutes, vehicleRoutes, bookingRoutes, extrasRoutes);

//listening for requests from front end
app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})
