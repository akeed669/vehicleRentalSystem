import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/register";
const apiEndpoint2 = apiUrl + "/users";
const apiEndpoint3 = apiUrl + "/user";

function customerUrl(id) {
  return `${apiEndpoint3}/${id}`;
}

export function register(user) {
  return http.post(apiEndpoint, {
    username: user.username,
    password: user.password,
    name: user.name,
    //role:user.role,
    dob:user.dob
  });
}

export function updateCustomer(user) {

  if (user._id) {
    const body = { ...user };
    delete body._id;
    return http.put(customerUrl(user._id), body);
  }
}

export function getCustomers() {
  return http.get(apiEndpoint2);
}

export function getCustomer(customerId) {
  return http.get(customerUrl(customerId));
}
//
// export function deleteCustomer(customerId) {
//   return http.delete(customerUrl(customerId));
// }
