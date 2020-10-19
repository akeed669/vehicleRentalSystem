import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getVehicle, saveVehicle } from "../services/vehicleService";
import { getGenres } from "../services/genreService";

//this form is used for adding new vehicles and displaying details
//of existing vehicles by populating the form

class BookingForm extends Form {
  //define state variables
  state = {
    data: { title: "", genreId: "", numberInStock: "",
    dailyRentalRate: "", start:"", end:"", extrasNeeded:false},
    genres: [],
    errors: {}
  };

  //schema to validate form
  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Title"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number In Stock"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("Daily Rental Rate"),
    start:Joi.date()
    .required()
    .greater('now')
    .label("Start Date"),
    end:Joi.date()
    .required()
    .greater(Joi.ref('start'))
    .label("Start Date"),
    extrasNeeded:Joi.boolean()
    .required()
    .label("Extras Required")
  };

  //method to populate form with vehicle types
  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  //populate form with vehicle details of selected vehicle
  async populateVehicle() {
    try {
      const vehicleId = this.props.match.params.id;
      if (vehicleId === "new") return;

      const { data: vehicle } = await getVehicle(vehicleId);
      //setting data in state to retrieved vehicle's data
      this.setState({ data: this.mapToViewModel(vehicle) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateVehicle();
  }

 //returns data of vehicle from database to be set to state variables
  mapToViewModel(vehicle) {
    return {
      _id: vehicle._id,
      title: vehicle.title,
      genreId: vehicle.genre._id,
      numberInStock: vehicle.numberInStock,
      dailyRentalRate: vehicle.dailyRentalRate
    };
  }

  doSubmit = async () => {
    //add new vehicle
    await saveVehicle(this.state.data);
    //redirect user to vehicles page after saving is complete
    this.props.history.push("/vehicles");
  };

  render() {
    //render a booking form
    return (
      <div>
        <h1>Booking Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number In Stock", "number")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderInput("start", "Start Date","date")}
          {this.renderInput("end", "End Date","date")}
          {this.renderInput("extrasNeeded", "Extras Required","checkbox")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default BookingForm;
