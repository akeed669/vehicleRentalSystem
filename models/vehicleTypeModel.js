const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleTypeSchema=new mongoose.Schema({

  vehicleTypeName:{
    type: String,
    required: true
  },

});


const VehicleType = mongoose.model('vehicleType', VehicleTypeSchema);

module.exports = VehicleType;
module.exports.eSchema = VehicleTypeSchema;
//admin should be able to add more extras
