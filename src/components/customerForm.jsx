import React from "react";
import Joi from "joi-browser";
import Moment from 'moment';

import Form from "./common/form";
import { getCustomer,updateCustomer } from "../services/userService";

class CustomerForm extends Form {
  state = {
    data: { _id:"", name: "", dob:"", blacklisted:"", repeater:"No" , role:""},
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    dob:Joi.date()
    .required()
    .label("Date of Birth"),
    repeater:Joi.string()
    .required()
    .label("Late Return"),
    name:Joi.string()
    .required()
    .label("Name"),
    blacklisted:Joi.string()
    .required()
    .label("Vehicle Returned"),
    role:Joi.string()
    .label("Role")
  };

  // async populateVehicles() {
  //   const { data: vehiclesObject } = await getVehicles();
  //   const vehicles=vehiclesObject.data;
  //   this.setState({ vehicles });
  // }

  // getCustomerId() {
  //   //const { data: vehiclesObject } = await getVehicles();
  //   const {_id:customer}=this.props.user;
  //   this.state.data.customer=customer;
  //   //this.setState({ data });
  // }

  // async populateExtras() {
  //   const { data: extrasObject } = await getExtras();
  //   const myExtras=extrasObject.data;
  //   this.setState({extras:myExtras});
  // }

  async populateCustomer() {
    try {
      const customerId = this.props.match.params.id;

      if (customerId === "new") return;

      const { data: customer } = await getCustomer(customerId);

      this.setState({ data: this.mapToViewModel(customer.data) });
      console.log(this.state.data)

    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {

    await this.populateCustomer();
    // await this.populateVehicles();
    //
    // await this.populateExtras().then(() => {
    //       this.setState({loading: false});
    //   })

    // this.getCustomerId();
  }

  mapToViewModel(customer) {

    const parsedCustomer = {...customer};
    parsedCustomer.blacklisted = customer.blacklisted === true?"Yes":"No";
    parsedCustomer.repeater = customer.repeater === true?"Yes":"No";

    return {
      _id: parsedCustomer._id,
      name:parsedCustomer.name,
      blacklisted:parsedCustomer.blacklisted,
      repeater:parsedCustomer.repeater,
      dob:Moment(parsedCustomer.dob).format('YYYY-MM-DD'),
      role:parsedCustomer.role
    };
  }

  doSubmit = async () => {

    const {data:customerData}=this.state;

    await updateCustomer(customerData);

    this.props.history.push("/movies");
  };

  render() {

    const disableInputs=this.props.user.role === "basic"?true:false;

    return (
      <div>
        <h1>Customer Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderSelect("name", "Name", [this.state.data.name], false, true)}
          {disableInputs && this.renderInput("license", "Driving License","text")}
          {this.renderInput("dob", "Date of Birth","date","form-control",true)}
          {this.renderSelect("blacklisted", "Blacklisted", ["Yes", "No"], false, disableInputs)}
          {this.renderSelect("repeater", "Repeater", ["Yes", "No"], false, disableInputs)}
          {this.renderButton("Save")}
        </form>
      </div>
    )
  }
}

export default CustomerForm;
