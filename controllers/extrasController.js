const Joi = require('joi');
//const Customer = require('../models/userModel');
//const { roles } = require('../roles')
const mongoose=require("mongoose")
//const Vehicle= require('../models/vehicleModel');
//const Rental= require('../models/rentalModel');
const Extra= require('../models/extrasModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

//let vehicleForBooking=""

exports.addExtra = async (req, res, next) => {
  try {
    const { error } = validateExtra(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {extraName, dailyCost} = req.body
    const newExtra = new Extra({ extraName, dailyCost });

    await newExtra.save();
    res.json({
      data: newExtra
    })

  } catch (error) {
    next(error)
  }
}

// exports.makeBooking = async (req, res, next) => {
//   try {
//     //const mycar=req.body;
//     //const test2=req.body.extra1;
//     const test2=req.body.myextra;
//     //const textra=req.body.horse;
//     //const addit=e.options[e.selectedIndex].text;
//     const isLate=req.body.late;
//     let lr=false;
//     if(isLate){
//       lr=true
//     }
//     const booking = new Rental({
//       vehicle:vehicleForBooking,
//       bookingExtra:test2,
//       lateReturn:lr
//       //customer:req.body.customer,
//     });
//     console.log(booking.vehicle)
//     await booking.save()
//     res.send("success")
//   } catch (error) {
//     next(error);
//   }
// }

// exports.listBookings = async (req, res, next) => {
//   try {
//     const bookings = await Rental
//     .find()
//     .populate('vehicle','fuelType')
//     res.render("allbookings",{"allBookings":bookings})
//   } catch (error) {
//     next(error);
//   }
// }
//
// exports.configureBooking = async (req, res, next) => {
//   try {
//     vehicleForBooking=req.body.mycar
//     const extraOptions = await Extra.find();
//     res.render("booking",{allExtras:extraOptions})
//   } catch (error) {
//     next(error);
//   }
// }


function validateExtra(req) {
  const schema = Joi.object({
    extraName: Joi.string().min(3).max(50).required(),
    dailyCost: Joi.integer().required()
  });

  return schema.validate(req);
}
