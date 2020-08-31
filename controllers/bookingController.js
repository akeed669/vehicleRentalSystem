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

    const startDate = new Date(req.body.startDate)
    const endDate = new Date(req.body.endDate)

    const needExtras=req.body.needExtras
    //let bextra=""
    if(endDate > new Date(startDate.getTime()+(14 * 24 * 60 * 60 * 1000))) return res.status(400).send("only 14 days max");

    const {customer, vehicle, bookingExtra, lateReturn} = req.body
    const bcustomer = await Customer.findById({ _id: req.body.customer});
    //checking whether the desired vehicle is available
    const bvehicle = await Vehicle.findById({ _id: req.body.vehicle});
    if (bvehicle.carsAvailable == 0) return res.status(400).send('Desired car not available');

    const insurance = await determineInsurance(req,res,bcustomer,bvehicle,next)
    let rentcost=0
    if(needExtras){
      //checking whether the desired extra is available
      const bextra = await Extra.findById({ _id: req.body.bookingExtra });
      if (bextra.unitsAvailable == 0) return res.status(400).send('Desired extra not available');
      const needExtras=true
      rentCost = await calculateRent(req,res,bvehicle,bextra,needExtras,next)
      eCost=await calculateExtras(req,res,bvehicle,bextra,needExtras,next)

      console.log(rentCost)
    } else{
      //const needExtras=false
      rentCost = await calculateRent(req,res,bvehicle,bextra,needExtras,next)
    }


    //changing the customer status after a booking
    await Customer.findByIdAndUpdate(bcustomer._id, {repeater:true});
    // bcustomer.repeater=true;
    // bcustomer.save()

    if(needExtras){

      const newBooking = new Booking({ customer, vehicle, startDate, endDate, bookingExtra, lateReturn, rentCost, needExtras, insurance });

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

    }else{
      const newBooking = new Booking({ customer, vehicle, startDate, endDate, lateReturn, rentCost, insurance, needExtras });

      await newBooking.save();

      req.body={
        vehicle:bvehicle._id,
        carsAvailable:bvehicle.carsAvailable-1,
      }
      //console.log(req)
      await vehicleController.updateVehicle(req,res,next)
    }


    // res.json({
    //   data: newBooking
    // })

  } catch (error) {
    next(error)
  }
}

function validateBooking(req) {

  const schema = Joi.object({
    customer:Joi.string().required(),
    vehicle:Joi.string().required(),
    bookingExtra:Joi.string(),
    startDate:Joi.date().greater('now'),
    //endDate:Joi.date().greater(Joi.ref('startDate')).max(Joi.ref('maxDate')).error(new Error("You can only rent a vehicle upto a maximum of 14 days")),
    endDate:Joi.date().greater(Joi.ref('startDate')),
    lateReturn: Joi.boolean().required(),
    needExtras:Joi.boolean().required(),
    //rentCost:Joi.number().required()
  });

  return schema.validate(req);
}

async function calculateRent(req,res,bvehicle,bextra,containsExtra,next){
  //get the dates
  const startDate = new Date(req.body.startDate)
  const endDate = new Date(req.body.endDate)
  //calculating the number of days for renting vehicle
  const diffTime = Math.abs(endDate - startDate);
  const rentDuration=Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //calculating rent charges
  const vehicleRent=bvehicle.dailyRent*rentDuration
  let extrasRent=0
  if(containsExtra){extrasRent=bextra.dailyCost*rentDuration}
  const rentCost=vehicleRent+extrasRent
  return rentCost
}

async function calculateExtras(){

}

async function determineInsurance (req,res,bcustomer,bvehicle,next){
  const diffTime = Math.abs(new Date() - bcustomer.dob);
  const currentAge=Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  if (currentAge < 25 && (bvehicle.vname!="Small Town Car")) {
    return false;
  }else{return true}
}
