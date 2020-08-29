const Joi = require('joi');
const Customer = require('../models/userModel');
const { roles } = require('../roles')
const mongoose=require("mongoose")
const Vehicle= require('../models/vehicleModel');
const Booking= require('../models/bookingModel');
const vehicleController = require('../controllers/vehicleController');
const extrasController = require('../controllers/extrasController');
const Extra= require('../models/extrasModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

let vehicleForBooking=""

exports.makeBooking = async (req, res, next) => {
  try {
    // const { error } = validateBooking(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    const {vehicle, bookingExtra, lateReturn} = req.body

    const bvehicle = await Vehicle.findOne({ vehicleId: req.body.vehicle.vehicleId });
    if (bvehicle.carsAvailable == 0) return res.status(400).send('Not available');

    const bextra = await Extra.findOne({ extraId: req.body.bookingExtra.extraId });
    if (bextra.unitsAvailable == 0) return res.status(400).send('Not available');

    const newBooking = new Booking({ vehicle, bookingExtra, lateReturn });

    await newBooking.save();

    req.body={
      vehicle:bvehicle._id,
      extra:bextra._id,
      carsAvailable:bvehicle.carsAvailable-1,
      unitsAvailable:bextra.unitsAvailable-1
    }
    //console.log(req)
    await vehicleController.updateVehicle(req,res,next)

    await extrasController.updateExtra(req,res,next)

    // res.json({
    //   data: newBooking
    // })

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


// function validateBooking(req) {
//   const schema = Joi.object({
//     vehicle: Joi.string().min(5).max(50).required(),
//     bookingExtra: Joi.string().min(5).max(255).required().email(),
//     lateReturn: Joi.string().min(5).max(255).required()
//   });
//
//   return schema.validate(req);
// }
