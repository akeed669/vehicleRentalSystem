const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer= require('../models/userModel');
const Vehicle= require('../models/vehicleModel');
const Extra=require('../models/extrasModel');
//const {vSchema} = require('../models/vehicleModel');

const RentSchema=new mongoose.Schema({

  // customer:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref: 'Customer',
  //   required: false
  // },
  vehicle:[{type:mongoose.Schema.Types.ObjectId, ref: 'vehicle', required: true}],
  // vehicle:{
  //   type:vSchema,
  //   required:true
  // }
  // daysRented:{
  //   type: Number,
  //   required: false
  // },
  // rentCost:{
  //   type: Number,
  //   required: true
  // },
  bookingExtra:[{type:mongoose.Schema.Types.ObjectId, ref: 'extra', required: true}],

  //bookingExtension:extensionSchema,
  lateReturn:{
    type: Boolean,
    default: false
  },
  // insurance:{
  //   type: Boolean,
  //   default: false
  // }
});

const Rental = mongoose.model('rental', RentSchema);

module.exports = Rental;
