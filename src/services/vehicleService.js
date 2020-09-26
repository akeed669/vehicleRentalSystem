import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/vehicles";

function vehicleUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getVehicles() {
  return http.get(apiEndpoint);
}

export function getVehicle(vehicleId) {
  return http.get(vehicleUrl(vehicleId));
}

export function saveVehicle(vehicle) {
  if (vehicle._id) {
    const body = { ...vehicle };
    delete body._id;
    return http.put(vehicleUrl(vehicle._id), body);
  }

  return http.post(apiEndpoint, vehicle);
}

export function deleteVehicle(vehicleId) {
  return http.delete(vehicleUrl(vehicleId));
}
