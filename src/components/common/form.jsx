import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
  //define state variables
  state = {
    data: {},
    errors: {}
  };

  validate = () => {
    // const options = { abortEarly: false };
    // const { error } = Joi.validate(this.state.data, this.schema, options);
    // if (!error) return null;
    //
    // const errors = {};
    // for (let item of error.details) errors[item.path[0]] = item.message;
    // return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    //prevent default behavior
    e.preventDefault();
    //first check errors by validating form
    const errors = this.validate();
    //set errors object in state
    this.setState({ errors: errors || {} });
    if (errors) return;
    //call submit method in form
    this.doSubmit();
  };

  handleChangeCheckBox=(e) => {
    //get current array of extras
    const bookingExtra = this.state.data.bookingExtra;  
    let index;

    // check if the check box is checked or unchecked
    if (e.target.checked) {

      // add the numerical value of the checkbox to bookingExtra array
      if(!bookingExtra.includes(e.target.value)){
        bookingExtra.push(e.target.value)
      }

    }
    else {

      // remove the value from the unchecked checkbox from the array
      index = bookingExtra.indexOf(e.target.value)
      bookingExtra.splice(index, 1)
    }

    // update the state with the new array of bookingExtra
    this.setState({ bookingExtra: bookingExtra });
  };


  // handleFile=(e) => {
  //
  //   const pictureFile = e.target.files[0];
  //   // update the state with the selected image
  //   this.setState({ picture: pictureFile });
  //   console.log(this.state.data)
  //
  // };

  //handleChange method for form elements
  handleChange = ({ currentTarget: input }) => {

    const errors = { ...this.state.errors };
    const error = this.validateProperty(input);
    if (error) errors[input.name] = error;
    else delete errors[input.name];

    const data = { ...this.state.data };

    if(input.name==="picture"){
      //data[input.name] = input.target.files[0];
    }
    data[input.name] = input.value;

    //set the state of elements after each change (ex:each letter entered)
    this.setState({ data, errors });

  };

  //for rendering buttons on form
  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }

  //for rendering checkbox components on form
  renderInput(name, label, type, bsClass, disabled) {
    if(type === undefined){type="text"}
    if(bsClass === undefined){bsClass="form-control"}
    const { data, errors } = this.state;

    //renders a custom component on form
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        bsClass={bsClass}
        disabled={disabled}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  //for rendering checkbox components on form
  renderCheckBox(name, label, type, bsClass, checkBoxValue) {
    if(type === undefined){type="text"}
    if(bsClass === undefined){bsClass="form-control"}
    const { data, errors } = this.state;

    //renders a custom component
    return (
      <Input
        type={type}
        name={name}
        value={checkBoxValue}
        label={label}
        bsClass={bsClass}
        onChange={this.handleChangeCheckBox}
        error={errors[name]}
      />
    );
  }

  //for rendering select components on form
  renderSelect(name, label, options, multiple, disabled) {
    if(multiple === undefined){multiple=false}
    const { data, errors } = this.state;

    //renders a custom component
    return (
      <Select
        multiple={multiple}
        name={name}
        value={data[name]}
        label={label}
        options={options}
        disabled={disabled}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
