import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/extras";

function extraUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getExtras() {
  return http.get(apiEndpoint);
}

export function getExtra(extraId) {
  return http.get(extraUrl(extraId));
}

export function saveExtra(extra) {
  if (extra._id) {
    const body = { ...extra };
    delete body._id;
    return http.put(extraUrl(extra._id), body);
  }

  return http.post(apiEndpoint, extra);
}

export function deleteExtra(extraId) {
  return http.delete(extraUrl(extraId));
}
