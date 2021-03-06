const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Customer= require('../models/userModel');
const Vehicle= require('../models/vehicleModel');
const Extra=require('../models/extrasModel');

//create booking schema for mongodb collection

const BookingSchema=new mongoose.Schema({

  customer:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },

  //a booking can have an array of vehicles ; references vehicles collection
  vehicle:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'vehicle',
      required: true
    }
  ],

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

  needExtras:{
    type: Boolean,
    required: true
  },

  //a booking can have an array of extras ; references vehicles collection
  bookingExtras:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'extra',
      required: false
    }
  ],

  lateReturn:{
    type: Boolean,
    default: false
  },

  vehiclePicked:{
    type: Boolean,
    default: false
  },

  vehicleReturned:{
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
