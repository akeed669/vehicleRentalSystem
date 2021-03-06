import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Customers from "./components/customers";
import Expedia from "./components/expedia";
import Vehicles from "./components/vehicles";
import BookingForm from "./components/bookingForm";
import CustomerForm from "./components/customerForm";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";

import auth from "./services/authService";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import ProtectedRoute from "./components/common/protectedRoute";

class App extends Component {
  state = {};

  componentDidMount() {
    //get the logged in user from storage
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {

    const user = auth.getCurrentUser();

    return (
      <React.Fragment>
        <ToastContainer />

        {/*render a navbar*/}
        <NavBar user={user} />
        <main className="container">

        {/*render a switch with all routes*/}
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/profile/:id"
            render={props => <CustomerForm {...props} user={user} />} />
            <ProtectedRoute path="/rentals/:id"
            render={props => <BookingForm {...props} user={user} />} />
            <ProtectedRoute
              path="/vehicles"
              render={props => <Vehicles {...props} user={user} />}
            />
            <ProtectedRoute
            path="/customers"
            render={props => <Customers {...props} user={user} />}
            />
            <ProtectedRoute
            path="/expedia"
            render={props => <Expedia {...props} user={user} />}
            />
            <ProtectedRoute
            path="/rentals"
            render={props => <Rentals {...props} user={user} />}
            />
            <Route path="/not-found" component={NotFound} />
            <Redirect from="/" exact to="/vehicles" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
