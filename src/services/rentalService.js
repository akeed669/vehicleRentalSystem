import http from "./httpService";
import { apiUrl } from "../config.json";

//set the endpoints for consuming vehicle rental related apis
const apiEndpoint = apiUrl + "/booking";
const apiEndpoint2 = apiUrl + "/bookings";
const apiEndpoint3 = apiUrl + "/bookings/user";

//function to generate custom endpoint
function rentalUrl(id) {
  return `${apiEndpoint}/${id}`;
}

//function to generate custom endpoint
function userRentalsUrl(id) {
  return `${apiEndpoint3}/${id}`;
}

//consume api to get all rentals
export function getRentals() {
  return http.get(apiEndpoint2);
}

//consume api to get all rentals of one user
export function getUserRentals(userId) {
  return http.get(userRentalsUrl(userId));
}

//consume api to get particular rentals
export function getRental(rentalId) {
  return http.get(rentalUrl(rentalId));
}

//consume api to add/update a rental
export function saveRental(rental) {
  //to update a rental
  if (rental._id) {
    const body = { ...rental };
    delete body._id;
    return http.put(rentalUrl(rental._id), body);
  }
  //to create new rental
  return http.post(apiEndpoint, rental);
}

//consume api to delete a rental
export function deleteRental(rentalId) {
  return http.delete(rentalUrl(rentalId));
}
