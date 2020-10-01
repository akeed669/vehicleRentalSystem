import React from "react";
import Joi from "joi-browser";
import Moment from 'moment';

import Form from "./common/form";
import { getVehicles, getVehicle, saveVehicle } from "../services/vehicleService";
import { getExtras } from "../services/extrasService";
import { getRental, saveRental } from "../services/rentalService";

class BookingForm extends Form {
  state = {
    data: { _id:"", vehicle: "", startDate:"", vehicleReturned:"No",
    endDate:"", customer:"", lateReturn:"", vehiclePicked:"No",  bookingExtra:[]},
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
    startDate:Joi.date()
    .required()
    .greater('now')
    .label("Start Date"),
    endDate:Joi.date()
    .required()
    //.greater(Joi.ref('startDate'))
    .label("Start Date"),
    lateReturn:Joi.string()
    .required()
    .label("Late Return"),
    bookingExtra:Joi.array()
    .min(0)
    .required()
    .label("Extras"),
    vehiclePicked:Joi.string()
    .label("Vehicle Picked"),
    vehicleReturned:Joi.string()
    .label("Vehicle Returned")
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

    await this.populateBooking();
    await this.populateVehicles();

    await this.populateExtras().then(() => {
          this.setState({loading: false});
      })

    this.getCustomerId();

  }

  mapToViewModel(booking) {

    const parsedBooking = {...booking};
    parsedBooking.lateReturn = booking.lateReturn === true?"Yes":"No";
    parsedBooking.vehiclePicked = booking.vehiclePicked === true?"Yes":"No";
    parsedBooking.vehicleReturned = booking.vehicleReturned === true?"Yes":"No";

    return {
      _id: parsedBooking._id,
      vehicle:parsedBooking.vehicle[0],
      startDate:Moment(parsedBooking.startDate).format('YYYY-MM-DD'),
      endDate:Moment(parsedBooking.endDate).format('YYYY-MM-DD'),
      bookingExtra:parsedBooking.bookingExtras,
      lateReturn:parsedBooking.lateReturn,
      vehiclePicked:parsedBooking.lateReturn,
      vehicleReturned:parsedBooking.lateReturn
    };
  }

  doSubmit = async () => {
    const {data:bookingData}=this.state;

    if(bookingData._id === ""){

      const dataxxx = { ...bookingData };
      delete dataxxx._id;
      await saveRental(dataxxx);
    }

    else{
      await saveRental(bookingData);
    }

    this.props.history.push("/movies");
  };

  render() {

    const { loading } = this.state;

    const {user} = this.props;

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
          {this.renderSelect("lateReturn", "Return Late", ["Yes", "No"])}
          {user.role==="admin" && this.renderSelect("vehiclePicked", "Vehicle Collected", ["Yes", "No"])}
          {user.role==="admin" && this.renderSelect("vehicleReturned", "Vehicle Returned", ["Yes", "No"])}
          {user.role==="basic" && this.renderCheckBox("bookingExtra", "Wine Chiller","checkbox","checkbox",this.state.extras[0]._id)}
          {user.role==="basic" && this.renderCheckBox("bookingExtra", "Baby seat","checkbox","checkbox",this.state.extras[1]._id)}
          {user.role==="basic" && this.renderCheckBox("bookingExtra", "SatNav","checkbox","checkbox",this.state.extras[2]._id)}
          {this.renderButton("Save")}
        </form>
      </div>
    )
  }
}

export default BookingForm;
