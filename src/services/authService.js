import jwtDecode from "jwt-decode";
import http from "./httpService";
import { apiUrl } from "../config.json";

//set the endpoint for consuming api for logging in
const apiEndpoint = apiUrl + "/login";
//use secret in .env file for encrypting jwt token
const tokenKey = process.env.JWT_SECRET;

//call function in http service
http.setJwt(getJwt());

export async function login(username, password) {
  //receive jwt token from server if login is success
  const { data: jwt } = await http.post(apiEndpoint, { username, password });
  //set jwt token in local storage of browser
  localStorage.setItem(tokenKey, jwt);
}

//function receives jwt token from register form
export function loginWithJwt(jwt) {
  //set jwt token in local storage of browser
  localStorage.setItem(tokenKey, jwt);
}

//remove jwt token from local storage
export function logout(user) {
  localStorage.removeItem(tokenKey);
}

//decodes jwt token in local storage
export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    //returned content in token (user details)
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

//obtain jwt token from local storage
export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt
};
