const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer= require('../models/userModel');
const Vehicle= require('../models/vehicleModel');
const Extra=require('../models/extrasModel');
//const {vSchema} = require('../models/vehicleModel');

const BookingSchema=new mongoose.Schema({

  customer:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },

  vehicle:[{type:mongoose.Schema.Types.ObjectId, ref: 'vehicle', required: true}],

  startDate:{
    type: Date,
    required: true
  },

  endDate:{
    type: Date,
    required: true,
    
  },

  rentCost:{
    type: Number,
    required: true
  },

  bookingExtra:[{type:mongoose.Schema.Types.ObjectId, ref: 'extra', required: false}],

  //bookingExtension:extensionSchema,
  lateReturn:{
    type: Boolean,
    default: false
  },

  insurance:{
    type: Boolean,
    required:true
  }
});

const Booking = mongoose.model('booking', BookingSchema);

module.exports = Booking;
