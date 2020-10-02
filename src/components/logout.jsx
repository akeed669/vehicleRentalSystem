import React, { Component } from "react";
import auth from "../services/authService";

class Logout extends Component {
  componentDidMount() {
    //call service function to logout as user
    auth.logout();
    //redirect to home for unlogged users
    window.location = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
