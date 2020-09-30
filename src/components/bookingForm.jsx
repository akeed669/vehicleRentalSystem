import React from "react";
import Joi from "joi-browser";
import Moment from 'moment';

import Form from "./common/form";
import { getVehicles, getVehicle, saveVehicle } from "../services/vehicleService";
import { getExtras } from "../services/extrasService";
import { getRental, saveRental } from "../services/rentalService";

class BookingForm extends Form {
  state = {
    data: { _id:"", vehicle: "", startDate:"",
    endDate:"", customer:"", lateReturn:false, needExtras:true, bookingExtra:[]},
    vehicles: [],
    extras: [],
    errors: {},
    loading:true,
  };

  schema = {
    _id: Joi.string(),
    customer: Joi.string()
      .required()
      .label("Customer"),
    vehicle: Joi.string()
      .required()
      .label("Vehicle"),
    // extraId: Joi.string()
    //   .required()
    //   .label("Extra"),
    startDate:Joi.date()
    .required()
    .greater('now')
    .label("Start Date"),
    endDate:Joi.date()
    .required()
    //.greater(Joi.ref('startDate'))
    .label("Start Date"),
    needExtras:Joi.boolean()
    .required()
    .label("Extras Required"),
    lateReturn:Joi.boolean()
    .required()
    .label("Late Return Required"),
    bookingExtra:Joi.array()
    .min(0)
    .required()
    .label("Extras")
  };

  async populateVehicles() {
    const { data: vehiclesObject } = await getVehicles();
    const vehicles=vehiclesObject.data;
    this.setState({ vehicles });
  }

  getCustomerId() {
    //const { data: vehiclesObject } = await getVehicles();
    const {_id:customer}=this.props.user;
    this.state.data.customer=customer;
    //this.setState({ data });
  }

  async populateExtras() {
    const { data: extrasObject } = await getExtras();
    const myExtras=extrasObject.data;
    this.setState({extras:myExtras});
  }

  async populateBooking() {
    try {
      const bookingId = this.props.match.params.id;

      if (bookingId === "new") return;

      const { data: booking } = await getRental(bookingId);

      this.setState({ data: this.mapToViewModel(booking.data) });
      console.log(this.state.data)

    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    //await this.populateGenres();
    await this.populateBooking();
    await this.populateVehicles();

    await this.populateExtras().then(() => {
          this.setState({loading: false});
      })

    this.getCustomerId();


  }

  mapToViewModel(booking) {
    return {
      _id: booking._id,
      vehicle:booking.vehicle[0],
      startDate:Moment(booking.startDate).format('YYYY-MM-DD'),
      endDate:Moment(booking.endDate).format('YYYY-MM-DD'),
      bookingExtra:booking.bookingExtras,
      lateReturn:false,
      needExtras:true
    };
  }

  doSubmit = async () => {
    const {data:bookingData}=this.state;

    if(bookingData._id === ""){
      console.log("biatch")
      const dataxxx = { ...bookingData };
      delete dataxxx._id;
      await saveRental(dataxxx);
    }

    await saveRental(bookingData);


    this.props.history.push("/movies");
  };

  render() {

    const { loading } = this.state;

    if(loading) {
      return <h1>waiting</h1>
    }

    return (
      <div>
        <h1>Booking Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderSelect("vehicle", "Vehicle", this.state.vehicles)}
          {this.renderInput("startDate", "Start Date","date")}
          {this.renderInput("endDate", "End Date","date")}
          {this.renderCheckBox("bookingExtra", "Wine Chiller","checkbox","checkbox",this.state.extras[0]._id)}
          {this.renderCheckBox("bookingExtra", "Baby seat","checkbox","checkbox",this.state.extras[1]._id)}
          {this.renderButton("Save")}
        </form>
      </div>
    )
  }
}

export default BookingForm;
