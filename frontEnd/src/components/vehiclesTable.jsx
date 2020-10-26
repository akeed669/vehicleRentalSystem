import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";

class VehiclesTable extends Component {
  //define the columns for the table
  //first column - cells are link objects
  columns = [
    {
      path: "vname",
      label: "Vehicle",
      content: vehicle => <Link to={`/vehicles/${vehicle._id}`}>{vehicle.vname}</Link>
    },
    { path: "carsAvailable", label: "Cars Available" },
    { path: "dailyRent", label: "Daily Rental Rate (LKR)" },

  ];

  //delete column only generated dynamically
  deleteColumn = {
    key: "delete",
    content: vehicle => (
      <button
        onClick={() => this.props.onDelete(vehicle)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  constructor() {
    super();
    //get user from local storage
    const user = auth.getCurrentUser();
    //delete column only generated for admin
    if (user && user.role==="admin") this.columns.push(this.deleteColumn);
  }

  render() {
    //render a table with defined columns and data from vehicles component
    const { vehicles, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={vehicles}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default VehiclesTable;
