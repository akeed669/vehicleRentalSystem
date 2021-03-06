const Joi = require('joi');
const Vehicle = require('../models/vehicleModel');
const VehicleType = require('../models/vehicleTypeModel');
const { roles } = require('../roles')
const mongoose=require("mongoose")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

//add vehicle to mongodb collection

exports.addVehicle = async (req, res, next) => {
  try {
    //validate received request body
    const { error } = validateVehicle(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if vehicle already exists in collection
    const vehicle = await Vehicle.findOne({ vname: req.body.vname });
    if (vehicle) return res.status(400).send('Vehicle already in database.');

    //destructure req body and create extra object
    const {vname, transmission, fuelType, dailyRent, carsAvailable, vehicleType} = req.body
    const newVehicle = new Vehicle({ vname, transmission, fuelType, dailyRent, carsAvailable,vehicleType });

    //save to collection ; send as response
    await newVehicle.save();
    res.json({
      data: newVehicle
    })

  } catch (error) {
    next(error)
  }
}

//add vehicle type to mongodb collection

exports.addVehicleType = async (req, res, next) => {
  try {
    const { error } = validateVehicleType(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const vehicleType = await VehicleType.findOne({ vehicleTypeName: req.body.vname });
    if (vehicleType) return res.status(400).send('Vehicle type already exists in database.');

    const {vehicleTypeName} = req.body
    const newVehicleType = new VehicleType({ vehicleTypeName });

    await newVehicleType.save();
    res.json({
      data: newVehicleType
    })

  } catch (error) {
    next(error)
  }
}

//send all vehicles from mongodb collection as a json response object
//with a status of 200 - success

exports.getVehicles = async (req, res, next) => {
  const vehicles = await Vehicle.find({});
  res.status(200).json({
    data: vehicles
  });
}

//send all vehicle types from collection as a json object

exports.getVehicleTypes = async (req, res, next) => {
  const vehicleTypes = await VehicleType.find({});
  res.status(200).json({
    data: vehicleTypes
  });
}

//get specific vehicle from mongodb collection; send response as json object
//with a status of 200 - success

exports.getVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleId;
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return next(new Error('Vehicle does not exist'));
    res.status(200).json({
      data: vehicle
    });
  } catch (error) {
    next(error)
  }
}

// exports.updateVehicle = async (req, res, next) => {
//   try {
//     // const { error } = validateUserReg(req.body);
//     // if (error) return res.status(400).send(error.details[0].message);
//     //const update = req.body
//     const vehicleId = req.params.vehicleId || req.body.vehicle;
//     //const vehicleId = vid;
//     //console.log(req.body.vehicle)
//     //const vehicle = await Vehicle.findById(vehicleId)
//     // const update={
//     //   carsAvailable:vehicle.carsAvailable-1
//     // }
//     const update = req.body
//
//     await Vehicle.findByIdAndUpdate(vehicleId, update);
//     const vehicle = await Vehicle.findById(vehicleId)
//     // res.status(200).json({
//     //   data: vehicle,
//     //   message: 'Vehicle has been updated'
//     // });
//   } catch (error) {
//     next(error)
//   }
// }

//delete specific vehicle from collection; send response

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleId;
    await Vehicle.findByIdAndDelete(vehicleId);
    res.status(200).send("This vehicle was deleted successfully!")
    // res.status(200).json({
    //   data: null,
    //   message: 'Vehicle has been deleted'
    // });
  } catch (error) {
    next(error)
  }
}

//use Joi to validate data received from request when creating a new vehicle

function validateVehicle(req) {
  const schema = Joi.object({
    vname: Joi.string().min(3).max(50).required(),
    transmission: Joi.string().min(6).max(9).required(),
    fuelType: Joi.string().min(6).max(6).required(),
    dailyRent: Joi.number().required(),
    carsAvailable: Joi.number().required().integer(),
    vehicleType:Joi.string().required(),
  });

  return schema.validate(req);
}

//use Joi to validate data when creating a new vehicle type

function validateVehicleType(req) {
  const schema = Joi.object({
    vehicleTypeName: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(req);
}
