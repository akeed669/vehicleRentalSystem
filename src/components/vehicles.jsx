import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import VehiclesTable from "./vehiclesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import { getVehicles, deleteVehicle } from "../services/vehicleService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import _ from "lodash";

class Vehicles extends Component {
  //define state variables
  state = {
    vehicles: [],
    genres: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {
    //get vehicle types from db
    const { data:genresObject } = await getGenres();
    const genresArray=genresObject.data;

    //update array of vehicle types
    const genres = [{ _id: "", vehicleTypeName: "All Vehicles" },...genresArray];

    //get vehicles from db
    const { data: vehiclesObject } = await getVehicles();

    const vehicles=vehiclesObject.data;
    //update state with received vehicles and vehicle types
    this.setState({ vehicles, genres });

  }

 //to delete a vehicle
  handleDelete = async vehicle => {
    const originalVehicles = this.state.vehicles;
    //remove selected vehicle from array
    const vehicles = originalVehicles.filter(v => v._id !== vehicle._id);
    //update state with filtered vehicles
    this.setState({ vehicles });

    try {
      //call api to delete vehicle
      await deleteVehicle(vehicle._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This vehicle has already been deleted.");

      this.setState({ vehicles: originalVehicles });
    }
  };

  //when user selects different page
  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  //when user selects different vehicle type
  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  //when user enters search query to search a vehicle
  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  //when user wants to sort table by particular column
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
      vehicles: allVehicles
    } = this.state;


    let filtered = allVehicles;

    //filter vehicles array if search query present
    if (searchQuery)
      filtered = allVehicles.filter(m =>
        m.vname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    //filter vehicles array if particular vehicle type selected
    else if (selectedGenre && selectedGenre._id) {
      filtered = allVehicles.filter(m => m.vehicleType === selectedGenre._id);
    }

    //sort vehicles array
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    //get proper amount of vehicles for each page
    const vehicles = paginate(sorted, currentPage, pageSize);

    //return number of vehicles for displaying and the data
    return { totalCount: filtered.length, data: vehicles };
  }

  render() {
    const { length: count } = this.state.vehicles;
    const {
      pageSize,
      currentPage,
      genres,
      selectedGenre,
      searchQuery,
      sortColumn
    } = this.state;

    //get logged in user
    const { user } = this.props;

    if (count === 0) return <p>There are no vehicles in the database.</p>;

    const { totalCount, data: vehicles } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">

        {/*render the vehicle types as a group - user able to filter*/}

          <ListGroup
            textProperty="vehicleTypeName"
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">

        {/*render button to create new rental order if user is a customer*/}

          {user.role === "basic" && (
            <Link
              to="rentals/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Rental
            </Link>
          )}
          <p>Showing {totalCount} vehicles in the database.</p>

          {/*render a search box to search for vehicles*/}
          <SearchBox value={searchQuery} onChange={this.handleSearch} />

          {/*render a table with vehicles*/}
          <VehiclesTable
            vehicles={vehicles}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          {/*render component for page selection*/}
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

export default Vehicles;
