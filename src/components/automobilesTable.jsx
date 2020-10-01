import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";

class AutomobilesTable extends Component {
  columns = [
    {
      path: "_carmodel",
      label: "Car Model"
    },
    { path: "_price", label: "Price ($)" },

  ];

  render() {
    const { automobiles, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={automobiles}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default AutomobilesTable;
