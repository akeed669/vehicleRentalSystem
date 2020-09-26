import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Like from "./common/like";
import Table from "./common/table";

class VehiclesTable extends Component {
  columns = [
    {
      path: "vname",
      label: "Vehicle",
      content: vehicle => <Link to={`/vehicles/${vehicle._id}`}>{vehicle.vname}</Link>
    },
    //{ path: "vehicleType.vname", label: "Vehicle Type" },
    { path: "carsAvailable", label: "Stock" },
    { path: "dailyRent", label: "Rate" },

  ];

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
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
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
