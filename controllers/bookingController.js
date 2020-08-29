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
    const { error } = validateBooking(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {customer, vehicle, bookingExtra, lateReturn} = req.body
    let insurance=true

    //checking whether the desired vehicle is available
    const bvehicle = await Vehicle.findById({ _id: req.body.vehicle});
    if (bvehicle.carsAvailable == 0) return res.status(400).send('Desired car not available');

    //checking whether the desired extra is available
    const bextra = await Extra.findById({ _id: req.body.bookingExtra });
    if (bextra.unitsAvailable == 0) return res.status(400).send('Desired extra not available');

    const {startDate,endDate,rentCost} = await calculateRent(req,res,bvehicle,bextra,next)

    const bcustomer = await Customer.findById({ _id: req.body.customer});
    const diffTime = Math.abs(new Date() - bcustomer.dob);
    const currentAge=Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    if (currentAge < 25 && (bvehicle.vname!="Small Town Car")) {
      insurance=false;
    };

    const newBooking = new Booking({ customer, vehicle, startDate, endDate, bookingExtra, lateReturn, rentCost, insurance });

    await newBooking.save();

    //setting the reqwiest body to update vehicle and extras availability
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


function validateBooking(req) {
  const schema = Joi.object({
    customer:Joi.string().required(),
    vehicle:Joi.string().required(),
    bookingExtra:Joi.string(),
    startDate:Joi.date().greater('now'),
    endDate:Joi.date().greater(Joi.ref('startDate')),
    lateReturn: Joi.string().min(5).max(255).required(),
    //rentCost:Joi.number().required()
  });

  return schema.validate(req);
}

async function calculateRent(req,res,bvehicle,bextra,next){
  //get the dates
  const startDate = new Date(req.body.startDate)
  const endDate = new Date(req.body.endDate)
  //calculating the number of days for renting vehicle
  const diffTime = Math.abs(endDate - startDate);
  const rentDuration=Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //calculating rent charges
  const vehicleRent=bvehicle.dailyRent*rentDuration
  const extrasRent=bextra.dailyCost*rentDuration
  const rentCost=vehicleRent+extrasRent
  return {startDate,endDate,rentCost}
}
