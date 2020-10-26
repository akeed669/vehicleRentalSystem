const Joi = require('joi');
const Customer = require('../models/userModel');
const mongoose=require("mongoose")
const Vehicle= require('../models/vehicleModel');
const Booking= require('../models/bookingModel');
const vehicleController = require('../controllers/vehicleController');
const extrasController = require('../controllers/extrasController');
const {getTaxIds} = require('../services/insuranceService');
const Extra= require('../models/extrasModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');


exports.makeBooking = async (req, res, next) => {
  try {
    //validate user input
    const { error } = validateBooking(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {customer, vehicle, lateReturn:returnLate, vehiclePicked:picked, vehicleReturned:returned} = req.body;
    //convert values to boolean before storing
    const lateReturn = returnLate==="Yes"?true:false;
    const vehiclePicked = picked==="Yes"?true:false;
    const vehicleReturned = returned==="Yes"?true:false;

    //check if blacklisted by insurance company
    if(vehiclePicked){
      //get tax id of customer for comparison
      const {councilTaxId} = await Customer.findById(customer);
      //receive ids of all fraudulent customers from external server
      const {data:taxIdsArray} = await getTaxIds();
      //compare user tax id against all fraudulent ids
      const checkLicense = obj => obj.councilTaxId === councilTaxId;
      //send error message if id matches any fraudulent ids
      if(taxIdsArray.some(checkLicense)){
        return res.status(400).send("This customer has been reported by the insurance company for fraud!")
      }
    }
    //initiailse variables
    let rentCost=0;
    let bookingExtra=null;
    //array of extras from request body
    let arrayExtras=req.body.bookingExtra;
    //check if customer has requested any extras
    const needExtras = arrayExtras.length>0 ? true : false;

    //get the dates for booking
    const startDate = new Date(req.body.startDate)
    const endDate = new Date(req.body.endDate)

    //check if booking duration exceeds 14 days and send error message
    if(endDate > new Date(startDate.getTime()+(14 * 24 * 60 * 60 * 1000))){
      return res.status(400).send("You can only rent a vehicle for a maximum of 14 days");
    }

    //find customer who wants to make booking
    const bookingCustomer = await Customer.findById({ _id: customer});

    //checking whether the customer has been blacklisted by admin
    if(bookingCustomer.blacklisted){
      return res.status(400).send('You have been blacklisted due to non completion of a previous booking!')
    }

    //checking whether the desired vehicle is available for rental
    const bookingVehicle = await Vehicle.findById({ _id: req.body.vehicle});
    if (bookingVehicle.carsAvailable == 0) return res.status(400).send('Desired car not available');

    //checking whether customer can be provided the late return option
    if(lateReturn){
      if (!bookingCustomer.repeater){
        return res.status(400).send('Late returns are not allowed for first time customers')
      }
    }

    //checking whether insurance can be provided
    const insurance = await determineInsurance(req,res,bookingCustomer,bookingVehicle,next)

    //give an alert if insurance is not applicable
    if(!insurance){
      console.log("No insurance for this booking!")
    }

    //create extras array for storing later
    let newextraObjects=new Array()

    //process if extras are required
    if(needExtras){

      //checking whether the desired extras are available for rental
      for (const item of arrayExtras){
        const bookingExtra = await Extra.findById({ _id: item })
        if (bookingExtra.unitsAvailable == 0) return res.status(400).send('Desired extra not available');
      }

      //calculate rental cost for vehicles
      const {vehicleRentCost,rentDuration} = await calculateVehicleRent(req,res,bookingVehicle,startDate,endDate,next);
      //calculate rental cost for extras
      const eCost=await calculateExtras(req,res,rentDuration,next);
      //determine total cost
      rentCost=eCost+vehicleRentCost;
    }
    //process if extras are not required
    else{
      //calculate total rental cost
      const {vehicleRentCost,rentDuration} = await calculateVehicleRent(req,res,bookingVehicle,startDate,endDate,next)
      rentCost=vehicleRentCost
    }

    //process if extras are required
    if(needExtras){

      const bookingExtras = req.body.bookingExtra;

      const bookingId = req.params.bookingId;
      //determine if booking is new or needs to be updated
      const isNewBooking = bookingId === undefined ? true : false;

      const bookingObj={ customer, vehicle, startDate, endDate, bookingExtras, lateReturn, rentCost, needExtras, insurance, vehiclePicked, vehicleReturned };

      if(!isNewBooking){
        //update existing booking
        await Booking.findByIdAndUpdate(bookingId, bookingObj);
        const updatedBooking = await Booking.findById(bookingId)
        res.status(200).json({
          data: updatedBooking,
          message: 'Booking has been updated'
        });

      } else {
        //create new booking
        const newBooking = new Booking(bookingObj);
        await newBooking.save();
        res.status(200).json({
          data: newBooking,
          message: 'Booking has been created'
        })
      }

      //changing the extras availability after a booking
      arrayExtras.forEach(async(item,i) => {

        const xxx = await Extra.findById({ _id: item });

        await Extra.findByIdAndUpdate(item,{
          unitsAvailable:xxx.unitsAvailable-1
        });
      });

    }

    //process if extras are not required
    else{
      const bookingId = req.params.bookingId;
      //determine if booking is new or needs to be updated
      const isNewBooking = bookingId === undefined ? true : false;

      const newBooking = new Booking({ customer, vehicle, startDate, endDate, lateReturn, rentCost, insurance, needExtras, vehiclePicked, vehicleReturned });

        if(!isNewBooking){
        //update existing booking
        await Booking.findByIdAndUpdate(bookingId, newBooking);
        const updatedBooking = await Booking.findById(bookingId)
        res.status(200).json({
          data: updatedBooking,
          message: 'Booking has been updated'
        });

      }

      else {
        //create new booking
        await newBooking.save();
        res.status(200).json({
          data: newBooking,
          message: 'Booking has been created'
        })
      }
    }
    //changing the customer status after a booking
    if(vehicleReturned){
      await Customer.findByIdAndUpdate(bookingCustomer._id, {repeater:true});
    }

    //changing the vehicle availability after a booking
    await Vehicle.findByIdAndUpdate(bookingVehicle._id,{
      carsAvailable:bookingVehicle.carsAvailable-1
    });
  }
  catch (error) {
    next(error)
  }
}


//validate user input in request object

function validateBooking(req) {

  const schema = Joi.object({
    customer:Joi.string().required(),
    vehicle:Joi.string().required(),
    bookingExtra:Joi.array().min(0).items(Joi.string()),
    startDate:Joi.date().greater('now'),
    endDate:Joi.date().greater(Joi.ref('startDate')),
    lateReturn: Joi.string().required(),
    vehiclePicked: Joi.string().required(),
    vehicleReturned: Joi.string().required(),
  });
  return schema.validate(req);
}

async function calculateVehicleRent(req,res,bookingVehicle,startDate,endDate,next){
  const diffTime = Math.abs(endDate - startDate);
  const rentDuration=Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //calculating rent charges
  const vehicleRentCost=bookingVehicle.dailyRent*rentDuration
  return {vehicleRentCost,rentDuration}
}

async function calculateExtras(req,res,rentDuration,next){

  let totalExtrasCost=0
  let arrayExtras=req.body.bookingExtra
  let itemsProcessed = 0;

  for (const item of arrayExtras){
    const xxx = await Extra.findById({ _id: item })

    totalExtrasCost+=xxx.dailyCost*rentDuration

  }
  return totalExtrasCost
}

async function determineInsurance (req,res,bookingCustomer,bookingVehicle,next){
  const diffTime = Math.abs(new Date() - bookingCustomer.dob);
  const currentAge=Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  if (currentAge < 25 && (bookingVehicle.vname!="Small Town Car")) {
    return false;
  }else{return true}
}

//send all bookings from mongodb collection as a json object

exports.getBookings = async (req, res, next) => {
  const bookings = await Booking.find({});
  res.status(200).json({
    data: bookings
  });
}

//get specific booking from collection; send response

exports.getBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    res.status(200).json({
      data: booking
    });
  } catch (error) {
    next(error)
  }
}

// exports.getBooking = async (req, res, next) => {
//   try {
//     const bookingId = req.params.bookingId;
//     const booking = await Booking.findById(bookingId).populate('customer');
//     res.status(200).json({
//       data: booking
//     });
//   } catch (error) {
//     next(error)
//   }
// }

//delete specific booking from collection; send response

exports.deleteBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({
      data: null,
      message: 'Booking has been deleted'
    });
  } catch (error) {
    next(error)
  }
}

//send all bookings of particular user from mongodb collection
//send as a json object

exports.getUserBookings = async (req, res, next) => {
  const userId = req.params.userId;
  const bookings = await Booking.find({customer:userId});
  res.status(200).json({
    data: bookings
  });
}
