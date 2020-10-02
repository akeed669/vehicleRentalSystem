import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Form {
  //state variables to hold input and errors
  state = {
    data: { name:"", username: "", password: "", dob:"" , license:"" ,councilTaxId:"", picture:"" },
    errors: {}
  };

  //schema to validate register form
  schema = {
    name: Joi.string().min(5).max(50).required().label("Name"),
    username: Joi.string().min(5).max(255).required().email().label("Username"),
    password: Joi.string().min(5).max(255).required().label("Password"),
    dob:Joi.date().less(new Date().toLocaleDateString()).label("Date of Birth"),
    license:Joi.string().min(6).max(6).required().label("Driving License"),
    councilTaxId:Joi.string().min(6).max(6).required().label("Council Tax Number"),
    picture:Joi.any().label("Customer Image")
  };

  doSubmit = async () => {
    try {
      const response = await userService.register(this.state.data);
      //call service function for registering
      auth.loginWithJwt(response.headers["x-auth-token"]);
      //redirect to home page
      window.location = "/";

    } catch (ex) {
      //catch http response errors
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    //render register form
    return (
      <div>
      <h1>Register</h1>
      <form onSubmit={this.handleSubmit}>
      {this.renderInput("name", "Name")}
      {this.renderInput("username", "Username")}
      {this.renderInput("license", "Driving License")}
      {this.renderInput("councilTaxId", "Council Tax Number")}
      {this.renderInput("picture", "Picture", "file")}
      {this.renderInput("password", "Password", "password")}
      {this.renderInput("dob", "Date of Birth","date")}
      {this.renderButton("Register")}
      </form>
      </div>
    );
  }
}

export default RegisterForm;
