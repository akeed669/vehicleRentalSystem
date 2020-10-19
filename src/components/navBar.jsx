import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {

  //render navbar with navlink components

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Rent-A-Ride
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav">
          <NavLink className="nav-item nav-link" to="/vehicles">
            Vehicles
          </NavLink>

          {/*render below components only if user is admin*/}

        {(user&&user.role==="admin")&& (
          <React.Fragment>
          <NavLink className="nav-item nav-link" to="/customers">
            Customers
          </NavLink>
          <NavLink className="nav-item nav-link" to="/expedia">
            Expedia Prices
          </NavLink>
          </React.Fragment>
        )}
          <NavLink className="nav-item nav-link" to="/rentals">
            Rentals
          </NavLink>

          {/*render below components only for logged in users*/}

          {!user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/login">
                Login
              </NavLink>
              <NavLink className="nav-item nav-link" to="/register">
                Register
              </NavLink>
            </React.Fragment>
          )}
          {(user) &&(
            <React.Fragment>
            {(user.name !="admin")&&(
              <NavLink className="nav-item nav-link" to={`/profile/${user._id}`}>
                {user.name}
              </NavLink>
            )}
            {(user.name == "admin")&&(
              <p className="nav-item nav-link">{user.name}</p>
            )}

              <NavLink className="nav-item nav-link" to="/logout">
                Logout
              </NavLink>
            </React.Fragment>
          )}

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
