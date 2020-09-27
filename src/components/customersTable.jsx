import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";

class CustomersTable extends Component {
  columns = [
    {
      path: "name",
      label: "Customer",
      content: customer => <Link to={`/customers/${customer._id}`}>{customer.vname}</Link>
    },
    { path: "dob", label: "Date of Birth" },
    { path: "blacklisted", label: "Blacklisted" },
    { path: "repeater", label: "Repeat Customer" },

  ];

  deleteColumn = {
    key: "delete",
    content: customer => (
      <button
        onClick={() => this.props.onDelete(customer)}
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
    const { customers, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={customers}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CustomersTable;
