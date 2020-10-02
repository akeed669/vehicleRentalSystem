import http from "./httpService";
import { apiUrl } from "../config.json";

//set the endpoint for consuming api for receiving
//scraped data from rentals website - external API
const apiEndpoint = apiUrl + "/expedia";

//consume api to get rental prices from expedia website  
export function getAutomobiles() {
  return http.get(apiEndpoint);
}
