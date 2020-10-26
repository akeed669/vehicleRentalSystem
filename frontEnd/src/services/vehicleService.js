import http from "./httpService";
import { apiUrl } from "../config.json";

//set the endpoint for consuming vehicle-related apis
const apiEndpoint = apiUrl + "/vehicles";

//function to generate custom endpoint
function vehicleUrl(id) {
  return `${apiEndpoint}/${id}`;
}

//consume api to receive list of vehicles
export function getVehicles() {
  return http.get(apiEndpoint);
}

//consume api to receive particular vehicles
export function getVehicle(vehicleId) {
  return http.get(vehicleUrl(vehicleId));
}

//consume api to add/update a new vehicle
export function saveVehicle(vehicle) {
  //for updating existing vehicle
  if (vehicle._id) {
    const body = { ...vehicle };
    delete body._id;
    return http.put(vehicleUrl(vehicle._id), body);
  }
  //for creating new vehicle
  return http.post(apiEndpoint, vehicle);
}

//consume api to delete a vehicles
export function deleteVehicle(vehicleId) {
  return http.delete(vehicleUrl(vehicleId));
}
