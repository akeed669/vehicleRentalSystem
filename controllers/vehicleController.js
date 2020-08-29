const Joi = require('joi');
const Vehicle = require('../models/vehicleModel');
const { roles } = require('../roles')
const mongoose=require("mongoose")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');

exports.addVehicle = async (req, res, next) => {
  try {
    const { error } = validateVehicle(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const vehicle = await Vehicle.findOne({ vname: req.body.vname });
    if (vehicle) return res.status(400).send('Vehicle already in database.');

    const {vname, transmission, fuelType, dailyRent, carsAvailable} = req.body
    const newVehicle = new Vehicle({ vname, transmission, fuelType, dailyRent, carsAvailable });

    await newVehicle.save();
    res.json({
      data: newVehicle
    })

  } catch (error) {
    next(error)
  }
}

exports.getVehicles = async (req, res, next) => {
  const vehicles = await Vehicle.find({});
  res.status(200).json({
    data: vehicles
  });
}

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

exports.updateVehicle = async (req, res, next) => {
  try {
    // const { error } = validateUserReg(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    //const update = req.body
    const vehicleId = req.params.vehicleId || req.body.vehicle;
    //const vehicleId = vid;
    //console.log(req.body.vehicle)
    //const vehicle = await Vehicle.findById(vehicleId)
    // const update={
    //   carsAvailable:vehicle.carsAvailable-1
    // }
    const update = req.body

    await Vehicle.findByIdAndUpdate(vehicleId, update);
    const vehicle = await Vehicle.findById(vehicleId)
    // res.status(200).json({
    //   data: vehicle,
    //   message: 'Vehicle has been updated'
    // });
  } catch (error) {
    next(error)
  }
}

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicleId;
    await Vehicle.findByIdAndDelete(vehicleId);
    res.status(200).json({
      data: null,
      message: 'Vehicle has been deleted'
    });
  } catch (error) {
    next(error)
  }
}

function validateVehicle(req) {
  const schema = Joi.object({
    vname: Joi.string().min(3).max(50).required(),
    transmission: Joi.string().min(6).max(9).required(),
    fuelType: Joi.string().min(6).max(6).required(),
    dailyRent: Joi.string().required(),
    carsAvailable: Joi.number().required()
  });

  return schema.validate(req);
}
