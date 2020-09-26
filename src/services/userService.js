import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/register";
//const apiEndpoint = apiUrl;

export function register(user) {
  return http.post(apiEndpoint, {
    username: user.username,
    password: user.password,
    name: user.name,
    //role:user.role,
    dob:user.dob
  });
}
