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

class Movies extends Component {
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
    const { data:genresObject } = await getGenres();
    const genresArray=genresObject.data;

    const genres = [{ _id: "", vehicleTypeName: "All Vehicles" },...genresArray];

    const { data: vehiclesObject } = await getVehicles();

    const vehicles=vehiclesObject.data;
    this.setState({ vehicles, genres });

  }

  handleDelete = async movie => {
    const originalMovies = this.state.vehicles;
    const vehicles = originalMovies.filter(m => m._id !== movie._id);
    this.setState({ vehicles });

    try {
      await deleteVehicle(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");

      this.setState({ vehicles: originalMovies });
    }
  };

  handleLike = movie => {
    const vehicles = [...this.state.vehicles];
    const index = vehicles.indexOf(movie);
    vehicles[index] = { ...vehicles[index] };
    vehicles[index].liked = !vehicles[index].liked;
    this.setState({ vehicles });
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
      vehicles: allMovies
    } = this.state;


    let filtered = allMovies;

    if (searchQuery)
      filtered = allMovies.filter(m =>
        m.vname.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id) {
      filtered = allMovies.filter(m => m.vehicleType === selectedGenre._id);
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const vehicles = paginate(sorted, currentPage, pageSize);

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
    const { user } = this.props;

    if (count === 0) return <p>There are no vehicles in the database.</p>;

    const { totalCount, data: vehicles } = this.getPagedData();
    
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            textProperty="vehicleTypeName"
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              to="vehicles/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              New Rental
            </Link>
          )}
          <p>Showing {totalCount} vehicles in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <VehiclesTable
            vehicles={vehicles}
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

export default Movies;
