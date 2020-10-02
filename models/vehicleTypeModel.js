const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create vehicle type schema for mongodb collection

const VehicleTypeSchema=new mongoose.Schema({

  vehicleTypeName:{
    type: String,
    required: true
  },

});


const VehicleType = mongoose.model('vehicleType', VehicleTypeSchema);

module.exports = VehicleType;
