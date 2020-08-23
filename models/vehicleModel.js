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
    required: true
  },
  fuelType:{
    type: String,
    required: true
  },
  dailyRent:{
    type: Number,
    required: true
  },
  carsOwned:{
    type: Number,
    required: true
  },
  // available:{
  //   type: Boolean,
  //   required: true
  // },

});

const Vehicle = mongoose.model('vehicle', VehicleSchema);

module.exports = Vehicle;
module.exports.vSchema = VehicleSchema;
