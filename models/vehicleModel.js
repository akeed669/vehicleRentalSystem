const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleSchema=new mongoose.Schema({

  vname:{
    //drop down list
    type: String,
    required: true
  },
  transmission:{
    type: String,
    required: true,
    enum: ["manual", "automatic"]
  },
  fuelType:{
    type: String,
    required: true,
    enum: ["petrol", "diesel", "hybrid"]
  },
  dailyRent:{
    type: Number,
    required: true
  },
  carsAvailable:{
    type: Number,
    required: true
  },
  // available:{
  //   type: Boolean,
  //   default: true,
  // },

});

const Vehicle = mongoose.model('vehicle', VehicleSchema);

module.exports = Vehicle;
module.exports.vSchema = VehicleSchema;
