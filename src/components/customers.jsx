import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CustomersTable from "./customersTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import { getCustomers, deleteCustomer } from "../services/userService";
import { paginate } from "../utils/paginate";
import _ from "lodash";

class Customers extends Component {
  state = {
    customers: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {

    const { data: customersObject } = await getCustomers();
    const customers=customersObject.data;
    this.setState({ customers });

  }

  // handleDelete = async movie => {
  //   const originalMovies = this.state.customers;
  //   const customers = originalMovies.filter(m => m._id !== movie._id);
  //   this.setState({ customers });
  //
  //   try {
  //     await deleteCustomer(movie._id);
  //   } catch (ex) {
  //     if (ex.response && ex.response.status === 404)
  //       toast.error("This movie has already been deleted.");
  //
  //     this.setState({ customers: originalMovies });
  //   }
  // };


  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData() {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      customers: allCustomers
    } = this.state;


    let filtered = allCustomers;

    if (searchQuery)
      filtered = allCustomers.filter(m =>
        m.vname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const customers = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: customers };
  }


  render() {

    const { length: count } = this.state.customers;
    const {
      pageSize,
      currentPage,
      searchQuery,
      sortColumn
    } = this.state;

    const { user } = this.props;

    if(user !== undefined && user.role !== "admin") return <p>You are not authorised to view this resource!</p>

    if (count === 0) return <p>There are no customers in the database.</p>;

    const { totalCount, data: customers } = this.getPagedData();

    return (
      <div className="row">
        <div className="col">
          <p>Showing {totalCount} customers in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <CustomersTable
            customers={customers}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Customers;
