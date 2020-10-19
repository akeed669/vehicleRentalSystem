const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create vehicle schema for mongodb collection

const VehicleSchema=new mongoose.Schema({

  vname:{
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

  //references table to set type of vehicle : "small town car" etc.
  vehicleType:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'vehicleType',
    required: true
  },

});

const Vehicle = mongoose.model('vehicle', VehicleSchema);

module.exports = Vehicle;
module.exports.vSchema = VehicleSchema;
