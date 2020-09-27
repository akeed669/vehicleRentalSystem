import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getVehicles, getVehicle, saveVehicle } from "../services/vehicleService";
import { getExtras } from "../services/extrasService";
import { getBooking, saveBooking } from "../services/rentalService";

class BookingForm extends Form {
  state = {
    data: { vehicle: "", startDate:"",
    endDate:"", customer:"", lateReturn:false, needExtras:true, bookingExtra:[]},
    vehicles: [],
    extras: [],
    errors: {},
    loading:true,
  };

  schema = {
    //_id: Joi.string(),
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

  // async populateGenres() {
  //   const { data: genres } = await getGenres();
  //   this.setState({ genres });
  // }

  async populateVehicles() {
    const { data: vehiclesObject } = await getVehicles();
    const vehicles=vehiclesObject.data;
    this.setState({ vehicles });
  }

  getCustomerId() {
    //const { data: vehiclesObject } = await getVehicles();
    const {_id:customer}=this.props.user;
    //console.log(customer)
    this.state.data.customer=customer;
    //this.setState({ data });
  }

  async populateExtras() {
    const { data: extrasObject } = await getExtras();
    const myExtras=extrasObject.data;
    console.log(myExtras);
    this.setState({extras:myExtras});
  }

  async populateMovie() {
    try {
      const movieId = this.props.match.params.id;
      if (movieId === "new") return;

      const { data: movie } = await getVehicle(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    //await this.populateGenres();
    await this.populateVehicles();

    await this.populateExtras().then(() => {
          this.setState({loading: false});
      })

    // try {
    //   await this.populateExtras();
    // } catch (e) {
    //
    // } finally {
    //   this.setState({ extras:myExtras, loading:false });
    //
    // }

    this.getCustomerId();


    // const { data:genresObject } = await getGenres();
    // const genresArray=genresObject.data;

    // const genres = [{ _id: "", vehicleTypeName: "All Vehicles" },...genresArray];

    // const { data: vehiclesObject } = await getVehicles();
    // const vehicles=vehiclesObject.data;
    //
    // this.setState({ vehicles, genres });
    //
    // await this.populateMovie();
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate
    };
  }

  doSubmit = async () => {
    const {data:bookingData}=this.state;
    console.log(bookingData);
    await saveBooking(bookingData);
    //this.props.history.push("/movies");
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
