import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/booking";

function bookingUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getBookings() {
  return http.get(apiEndpoint);
}

export function getBooking(bookingId) {
  return http.get(bookingUrl(bookingId));
}

export function saveBooking(booking) {
  if (booking._id) {
    const body = { ...booking };
    delete body._id;
    return http.put(bookingUrl(booking._id), body);
  }

  return http.post(apiEndpoint, booking);
}

export function deleteBooking(bookingId) {
  return http.delete(bookingUrl(bookingId));
}
