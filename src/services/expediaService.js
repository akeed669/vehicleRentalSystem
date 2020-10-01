import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/expedia";

export function getAutomobiles() {
  return http.get(apiEndpoint);
}
