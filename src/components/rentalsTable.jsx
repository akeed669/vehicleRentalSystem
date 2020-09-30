import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Like from "./common/like";
import Table from "./common/table";

class RentalsTable extends Component {
  columns = [
    {
      path: "vehicle",
      label: "Vehicle",
      content: rental => <Link to={`/rentals/${rental._id}`}>{rental.vehicle}</Link>
    },
    { path: "startDate", label: "From" },
    { path: "endDate", label: "Until" },
    { path: "lateReturn", label: "Returning Late" },
    { path: "insurance", label: "Insurance covered" },
    { path: "rentCost", label: "Rental Charges" },

  ];

  deleteColumn = {
    key: "delete",
    content: rental => (
      <button
        onClick={() => this.props.onDelete(rental)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.role==="admin") this.columns.push(this.deleteColumn);
  }

  render() {
    const { rentals, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={rentals}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default RentalsTable;
