import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";

class RentalsTable extends Component {
  columns = [
    {
      path: "_id",
      label: "Rental",
      content: rental => <Link to={`/rentals/${rental._id}`}>{rental._id}</Link>
    },
    { path: "customer", label: "Customer" },
    { path: "vehicle", label: "Vehicle" },
    { path: "startDate", label: "From" },
    { path: "endDate", label: "Until" },
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
