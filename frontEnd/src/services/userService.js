import http from "./httpService";
import { apiUrl } from "../config.json";

//set the endpoints for consuming customer-related apis
const apiEndpoint = apiUrl + "/register";
const apiEndpoint2 = apiUrl + "/users";
const apiEndpoint3 = apiUrl + "/user";

//function to generate custom endpoint
function customerUrl(id) {
  return `${apiEndpoint3}/${id}`;
}

//consume api to add a new customer
export function register(user) {
  return http.post(apiEndpoint, {
    username: user.username,
    password: user.password,
    name: user.name,
    license: user.license,
    councilTaxId: user.councilTaxId,
    dob:user.dob
  });
}

//consume api to update a new customer
export function updateCustomer(user) {
  if (user._id) {
    const body = { ...user };
    delete body._id;
    return http.put(customerUrl(user._id), body);
  }
}

//consume api to get all customers
export function getCustomers() {
  return http.get(apiEndpoint2);
}

//consume api to get particular customer
export function getCustomer(customerId) {
  return http.get(customerUrl(customerId));
}

//consume api to delete a customer
export function deleteCustomer(customerId) {
  return http.delete(customerUrl(customerId));
}
