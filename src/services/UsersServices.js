import Service from "./Service";
import { API_URL } from "../config";

const resource = `${API_URL}`;

export default {
  getAllItems(page) {
    return Service.get(`${resource}/users?page=` + page).then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    });
  },
  createUser(userData) {
    return Service.post(`${resource}/users/`, userData).then((response) => {
      if (response.status === 201) {
        return response.data;
      }
    });
  },
  updataUser(id, data) {
    return Service.put(`${resource}/users/${id}`, data).then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    });
  },
  deleteUser(id) {
    return Service.delete(`${resource}/users/${id}`).then((response) => {
      if (response.status === 204) {
        return true;
      }
    });
  },
  registerUser(userData) {
    return Service.post(`${resource}/register/`, userData).then((response) => {
      if (response.status === 200) {
        return response.data;
      }
    });
  },
};
