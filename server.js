const express = require('express');  //
const mongoose = require('mongoose');
const ejs=require("ejs");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
const Customer = require('./models/userModel')
const customerRoutes = require('./routes/customerRoutes.js');
const vehicleRoutes = require('./routes/vehicleRoutes.js');
const bookingRoutes = require('./routes/bookingRoutes.js');
const extrasRoutes = require('./routes/extrasRoutes.js');
const cors = require('cors')
// require("dotenv").config({
//   path: path.join(__dirname, "../.env")
// });

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(cors())

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;

mongoose
.connect('mongodb://localhost:27017/mydb',{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex :true})
.then(() => {
  mongoose.set('useFindAndModify', false);
  console.log('Connected to the Database successfully');
})
.catch (error => console.error("Could not connect",error))

app.use('/', customerRoutes, vehicleRoutes,bookingRoutes,extrasRoutes);

app.listen(PORT, () => {
  console.log('Server is listening on Port:', PORT)
})
