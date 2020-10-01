import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import Select from "./select";

class Form extends Component {
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
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChangeCheckBox=(e) => {
    // current array of options
    const bookingExtra = this.state.data.bookingExtra;
    let lateReturnBox = this.state.data.lateReturn;
    let index;

    // check if the check box is checked or unchecked
    if (e.target.checked) {

      if(e.target.value == "late"){
        lateReturnBox=true;
      }

      // add the numerical value of the checkbox to bookingExtra array

      else if(!bookingExtra.includes(e.target.value)){
        bookingExtra.push(e.target.value)
      }


    } else {

      if(e.target.value == "late"){
        lateReturnBox=false;
      }

      // or remove the value from the unchecked checkbox from the array
      else{
        index = bookingExtra.indexOf(e.target.value)
        bookingExtra.splice(index, 1)
      }
    }

    // update the state with the new array of bookingExtra
    this.setState({ bookingExtra: bookingExtra });

    this.setState(() => ({
      lateReturn:lateReturnBox
    }));

    console.log(this.state.data)
    console.log(lateReturnBox)
  };

  handleChange = ({ currentTarget: input }) => {

    const errors = { ...this.state.errors };
    const error = this.validateProperty(input);
    if (error) errors[input.name] = error;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });

  };


  renderButton(label) {
    return (
      <button disabled={this.validate()} className="btn btn-primary">
        {label}
      </button>
    );
  }


  renderInput(name, label, type, bsClass) {
    if(type === undefined){type="text"}
    if(bsClass === undefined){bsClass="form-control"}
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        bsClass={bsClass}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }

  renderCheckBox(name, label, type, bsClass, checkBoxValue) {
    if(type === undefined){type="text"}
    if(bsClass === undefined){bsClass="form-control"}
    const { data, errors } = this.state;
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

  renderSelect(name, label, options, multiple) {
    if(multiple === undefined){multiple=false}
    const { data, errors } = this.state;

    return (
      <Select
        multiple={multiple}
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        error={errors[name]}
      />
    );
  }
}

export default Form;
