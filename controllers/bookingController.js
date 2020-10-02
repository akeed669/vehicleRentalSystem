const Joi = require('joi');
const Customer = require('../models/userModel');
const { roles } = require('../roles')
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

//let vehicleForBooking=""

exports.makeBooking = async (req, res, next) => {
  try {

    const { error } = validateBooking(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {customer, vehicle, lateReturn:returnLate, vehiclePicked:picked, vehicleReturned:returned} = req.body;
    const lateReturn = returnLate==="Yes"?true:false;
    const vehiclePicked = picked==="Yes"?true:false;
    const vehicleReturned = returned==="Yes"?true:false;

    //check if blacklisted by insurance company
    if(vehiclePicked){

      console.log(customer)
      const {councilTaxId} = await Customer.findById(customer);
      console.log(councilTaxId)

      const {data:taxIdsArray} = await getTaxIds();
      const checkLicense = obj => obj.councilTaxId === councilTaxId;
      if(taxIdsArray.some(checkLicense)){
        return res.status(400).send("This customer has been reported by the insurance company for fraud!")
      }
    }

    let rentCost=0;
    let bextra=null;
    let arrayExtras=req.body.bookingExtra;

    const needExtras = arrayExtras.length>0 ? true : false;

    //get the dates
    const startDate = new Date(req.body.startDate)
    //startDate.setHours(0,0,0,0)
    const endDate = new Date(req.body.endDate)

    if(endDate > new Date(startDate.getTime()+(14 * 24 * 60 * 60 * 1000))) return res.status(400).send("only 14 days max");

    const bcustomer = await Customer.findById({ _id: customer});

    //checking whether the customer has been blacklisted
    if(bcustomer.blacklisted){
      return res.status(400).send('You have been blacklisted due to non completion of a previous booking!')
    }

    //checking whether the desired vehicle is available
    const bvehicle = await Vehicle.findById({ _id: req.body.vehicle});
    if (bvehicle.carsAvailable == 0) return res.status(400).send('Desired car not available');

    //checking whether customer can be provided the late return option
    if(lateReturn){
      if (!bcustomer.repeater){
        return res.status(400).send('Late returns are not allowed for first time customers')
      }
    }

    //checking whether insurance can be provided
    const insurance = await determineInsurance(req,res,bcustomer,bvehicle,next)

    //give an alert if insurance is not applicable
    if(!insurance){
      console.log("No insurance for this booking!")
    }

    let newextraObjects=new Array()

    if(needExtras){

      //checking whether the desired extras are available
      for (const item of arrayExtras){
        const bextra = await Extra.findById({ _id: item })
        if (bextra.unitsAvailable == 0) return res.status(400).send('Desired extra not available');
      }

      const {vehicleRentCost,rentDuration} = await calculateVehicleRent(req,res,bvehicle,startDate,endDate,next)
      const eCost=await calculateExtras(req,res,rentDuration,next)
      rentCost=eCost+vehicleRentCost
    }
    else{
      const {vehicleRentCost,rentDuration} = await calculateVehicleRent(req,res,bvehicle,startDate,endDate,next)
      rentCost=vehicleRentCost
    }

    if(needExtras){

      const bookingExtras = req.body.bookingExtra;

      const bookingId = req.params.bookingId;

      const isNewBooking = bookingId === undefined ? true : false;

      const bookingObj={ customer, vehicle, startDate, endDate, bookingExtras, lateReturn, rentCost, needExtras, insurance, vehiclePicked, vehicleReturned };

      if(!isNewBooking){

        await Booking.findByIdAndUpdate(bookingId, bookingObj);
        const updatedBooking = await Booking.findById(bookingId)
        res.status(200).json({
          data: updatedBooking,
          message: 'Booking has been updated'
        });

      } else {
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

    }else{

      const newBooking = new Booking({ customer, vehicle, startDate, endDate, lateReturn, rentCost, insurance, needExtras, vehiclePicked, vehicleReturned });

      await newBooking.save();

      await Vehicle.findByIdAndUpdate(bvehicle._id,{
        carsAvailable:bvehicle.carsAvailable-1
      });

      res.json({
        data: newBooking
      })
    }

    //changing the customer status after a booking
    if(vehicleReturned){
      await Customer.findByIdAndUpdate(bcustomer._id, {repeater:true});
    }

    //changing the vehicle availability after a booking
    await Vehicle.findByIdAndUpdate(bvehicle._id,{
      carsAvailable:bvehicle.carsAvailable-1
    });

  } catch (error) {
    next(error)
  }
}

function validateBooking(req) {

  const schema = Joi.object({
    customer:Joi.string().required(),
    vehicle:Joi.string().required(),
    bookingExtra:Joi.array().min(0).items(Joi.string()),
    startDate:Joi.date().greater('now'),
    //endDate:Joi.date().greater(Joi.ref('startDate')).max(Joi.ref('maxDate')).error(new Error("You can only rent a vehicle upto a maximum of 14 days")),
    endDate:Joi.date().greater(Joi.ref('startDate')),
    lateReturn: Joi.string().required(),
    vehiclePicked: Joi.string().required(),
    vehicleReturned: Joi.string().required(),
    //rentCost:Joi.number().required()
  });
  return schema.validate(req);
}

async function calculateVehicleRent(req,res,bvehicle,startDate,endDate,next){
  const diffTime = Math.abs(endDate - startDate);
  const rentDuration=Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //calculating rent charges
  const vehicleRentCost=bvehicle.dailyRent*rentDuration
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

async function determineInsurance (req,res,bcustomer,bvehicle,next){
  const diffTime = Math.abs(new Date() - bcustomer.dob);
  const currentAge=Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  if (currentAge < 25 && (bvehicle.vname!="Small Town Car")) {
    return false;
  }else{return true}
}

// exports.updateBooking = async (req, res, next) => {
//   try {
//     const update = req.body
//     const bookingId = req.params.bookingId;
//
//     // //check whether an extension is desired
//     // const oldbooking = await Booking.findById(bookingId)
//     // const oldReturnDate=oldbooking.endDate
//     // if(req.body.endDate){
//     //   if(req.body.endDate != oldReturnDate){
//     //     console.log("change needed")
//     //   }
//     // }else{
//     //   console.log("no change needed")
//     // }
//
//
//     await Booking.findByIdAndUpdate(bookingId, update);
//     const updatedBooking = await Booking.findById(bookingId)
//     res.status(200).json({
//       data: updatedBooking,
//       message: 'Booking has been updated'
//     });
//   } catch (error) {
//     next(error)
//   }
// }

exports.getBookings = async (req, res, next) => {
  const bookings = await Booking.find({});
  res.status(200).json({
    data: bookings
  });
}

exports.getBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId);
    //if (!user) return next(new Error('Booking does not exist'));
    res.status(200).json({
      data: booking
    });
  } catch (error) {
    next(error)
  }
}

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

exports.getUserBookings = async (req, res, next) => {
  const userId = req.params.userId;
  const bookings = await Booking.find({customer:userId});
  res.status(200).json({
    data: bookings
  });
}
