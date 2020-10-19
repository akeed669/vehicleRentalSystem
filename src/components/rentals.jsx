import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import RentalsTable from "./rentalsTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import { getRentals, getUserRentals, deleteRental } from "../services/rentalService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import _ from "lodash";

class Rentals extends Component {
  state = {
    rentals: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {

    const {user} = this.props;
    let rentals=""

    if(user.role === "basic"){

      const { data: rentalsObject } = await getUserRentals(user._id);
      rentals=rentalsObject.data;


    } else {
      const { data: rentalsObject } = await getRentals();
      rentals=rentalsObject.data;
    }

    this.setState({ rentals });

  }

  handleDelete = async rental => {
    const originalRentals = this.state.rentals;
    const rentals = originalRentals.filter(m => m._id !== rental._id);
    this.setState({ rentals });

    try {
      await deleteRental(rental._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This rental has already been deleted.");

      this.setState({ rentals: originalRentals });
    }
  };


  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
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
      selectedGenre,
      searchQuery,
      rentals: allRentals
    } = this.state;

    let filtered = allRentals;

    if (searchQuery)
      filtered = allRentals.filter(m =>
        m.vname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id) {
      filtered = allRentals.filter(m => m.rentalType === selectedGenre._id);
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const rentals = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: rentals };
  }

  render() {
    const { length: count } = this.state.rentals;
    const {
      pageSize,
      currentPage,
      genres,
      selectedGenre,
      searchQuery,
      sortColumn,
    } = this.state;

    const { user } = this.props;

    if (count === 0) return <p>There are no rentals in the database.</p>;

    const { totalCount, data: rentals } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            textProperty="rentalTypeName"
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user.role === "basic" && (
            <Link
              to="rentals/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Rental
            </Link>
          )}
          <p>Showing {totalCount} rentals in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <RentalsTable
            rentals={rentals}
            sortColumn={sortColumn}
            onLike={this.handleLike}
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

export default Rentals;
