import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AutomobilesTable from "./automobilesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import { getAutomobiles } from "../services/expediaService";
import { paginate } from "../utils/paginate";
import _ from "lodash";

class Expedia extends Component {
  state = {
    automobiles: [],
    currentPage: 1,
    pageSize: 4,
    sortColumn: { path: "title", order: "asc" }
  };

  async componentDidMount() {

    const { data: automobilesObject } = await getAutomobiles();
    console.log(automobilesObject)
    const automobiles=automobilesObject.data;
    this.setState({ automobiles });
  }


  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData() {
    const {
      pageSize,
      currentPage,
      sortColumn,
      automobiles: allAutomobiles
    } = this.state;

    let filtered = allAutomobiles;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const automobiles = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: automobiles };
  }


  render() {

    const { length: count } = this.state.automobiles;
    const {
      pageSize,
      currentPage,
      sortColumn
    } = this.state;

    const { user } = this.props;

    if(user !== undefined && user.role !== "admin") return <p>You are not authorised to view this resource!</p>

    if (count === 0) return <p>There are no automobiles in the database.</p>;

    const { totalCount, data: automobiles } = this.getPagedData();

    return (
      <div className="row">
        <div className="col">
          <p>Showing {totalCount} automobiles in the database.</p>        
          <AutomobilesTable
            automobiles={automobiles}
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

export default Expedia;
