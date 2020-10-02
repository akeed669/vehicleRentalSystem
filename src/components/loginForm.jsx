import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class LoginForm extends Form {
  //state variables to hold login credentials and errors
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  //schema to validate login form
  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      //call service function for logging in
      await auth.login(data.username, data.password);
      //access user location history for redirecting appropriately
      const { state } = this.props.location;
      //redirect to previous location
      window.location = state ? state.from.pathname : "/";
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
    //check if user already logged in and redirect to home
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    //render login form
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Login")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
