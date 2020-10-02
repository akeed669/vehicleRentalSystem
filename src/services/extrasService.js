import http from "./httpService";
import { apiUrl } from "../config.json";

//set the endpoints for consuming booking extra-related apis
const apiEndpoint = apiUrl + "/extras";

//function to generate custom endpoint
function extraUrl(id) {
  return `${apiEndpoint}/${id}`;
}

//consume api to get all extras
export function getExtras() {
  return http.get(apiEndpoint);
}

//consume api to get particular extra
export function getExtra(extraId) {
  return http.get(extraUrl(extraId));
}

//consume api to add/update extras
export function saveExtra(extra) {
  if (extra._id) {
    const body = { ...extra };
    delete body._id;
    return http.put(extraUrl(extra._id), body);
  }

  return http.post(apiEndpoint, extra);
}

//consume api to delete an extra
export function deleteExtra(extraId) {
  return http.delete(extraUrl(extraId));
}
