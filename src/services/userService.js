import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/register";
const apiEndpoint2 = apiUrl + "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    username: user.username,
    password: user.password,
    name: user.name,
    //role:user.role,
    dob:user.dob
  });
}

export function getCustomers() {
  return http.get(apiEndpoint2);
}

// export function getCustomer(customerId) {
//   return http.get(customerUrl(customerId));
// }
//
// export function deleteCustomer(customerId) {
//   return http.delete(customerUrl(customerId));
// }
