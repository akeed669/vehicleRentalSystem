import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: { name:"", username: "", password: "", dob:"" },
    errors: {}
  };

  schema = {

    name: Joi.string().min(5).max(50).required().label("Name"),
    username: Joi.string().min(5).max(255).required().email().label("Username"),
    password: Joi.string().min(5).max(255).required().label("Password"),
    //role: Joi.string().min(5).max(5).label("Role"),
    dob:Joi.date().less(new Date().toLocaleDateString()).label("Date of Birth"),

  };

  doSubmit = async () => {
    try {
      console.log(this.state.data)
      const response = await userService.register(this.state.data);
      console.log("ho3")
      auth.loginWithJwt(response.headers["x-auth-token"]);

      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
      <h1>Register</h1>
      <form onSubmit={this.handleSubmit}>
      {this.renderInput("name", "Name")}
      {this.renderInput("username", "Username")}
      {this.renderInput("password", "Password", "password")}
      {this.renderInput("dob", "Date of Birth","date")}
      {this.renderButton("Register")}
      </form>
      </div>
    );
  }
}

export default RegisterForm;
