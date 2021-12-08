import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
// Booststrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

axios.defaults.baseURL = "https://reqres.in/api";
const userToken = store.getters.isError
  ? store.getters.isToken
  : localStorage.getItem("token");
if (userToken) {
  axios.defaults.headers.common.Authorization = "Bearer " + userToken;
  axios.defaults.headers["Content-type"] = "application/json";
  axios.defaults.headers.accept = "*/*";
}
// Check User Is Authorized
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("loginData");
      return router.push("/login");
    }
    return Promise.reject(error.response);
  }
);

createApp(App).use(store).use(router).mount("#app");
