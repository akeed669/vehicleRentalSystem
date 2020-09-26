import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Like from "./common/like";
import Table from "./common/table";

class MoviesTable extends Component {
  columns = [
    {
      path: "vname",
      label: "Vehicle",
      content: movie => <Link to={`/movies/${movie._id}`}>{movie.vname}</Link>
    },
    //{ path: "vehicleType.vname", label: "Vehicle Type" },
    { path: "carsAvailable", label: "Stock" },
    { path: "dailyRent", label: "Rate" },

  ];

  deleteColumn = {
    key: "delete",
    content: movie => (
      <button
        onClick={() => this.props.onDelete(movie)}
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
    const { movies, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={movies}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default MoviesTable;
