import axios from "axios";
import logger from "./logService";
import { toast } from "react-toastify";


// axios.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     toast.success(response.data);
//   })

//use interceptors for catching errors
axios.interceptors.response.use(null, error => {
  const expectedError =
  error.response &&
  error.response.status >= 400 &&
  error.response.status < 500;

  //errors not in above range
  if (!expectedError) {
    logger.log(error);
    //toast message shown to user
    toast.error("An unexpected error occurred.");
  }

  //for understood errors (from back-end)
  else{
    //toast message shown to user
    toast.error(error.response.data);
  }

  return Promise.reject(error);
});

//insert the jwt token into header
function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt
};
