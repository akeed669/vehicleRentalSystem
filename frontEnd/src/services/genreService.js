import http from "./httpService";
import { apiUrl } from "../config.json";

//consume api to get vehicle types (ex:small town car)
export function getGenres() {
  return http.get(apiUrl + "/vehicleTypes");
}
