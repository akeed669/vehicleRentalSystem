const axios = require("axios");
// const logger = require("./logService");
// const { toast } = require("react-toastify");

// axios.interceptors.response.use(null, error => {
//   const expectedError =
//   error.response &&
//   error.response.status >= 400 &&
//   error.response.status < 500;
//
//   if (!expectedError) {
//     logger.log(error);
//     toast.error("An unexpected error occurrred.");
//   }
//
//   else{
//     toast.error(error.response.data);
//   }
//
//   return Promise.reject(error);
// });

exports.get = () => {
  return axios.get;
}


//
// function setJwt(jwt) {
//   axios.defaults.headers.common["x-auth-token"] = jwt;
// }

// export default {
//   get: axios.get,
//   // post: axios.post,
//   // put: axios.put,
//   // delete: axios.delete,
//   // setJwt
// };
