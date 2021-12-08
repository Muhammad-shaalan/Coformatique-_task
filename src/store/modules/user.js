import axios from "axios";
export default {
  state: {
    token: localStorage.getItem("token"),
    userToken: false,
    error: false,
  },
  getters: {
    isError(state) {
      return state.error;
    },
    // Get Token if no reload
    isToken(state) {
      return state.userToken;
    },
  },
  mutations: {
    setLoginData(state, token) {
      state.userToken = token;
      localStorage.setItem("token", JSON.stringify(token));
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    setLoginError(state, error) {
      state.error = error;
    },
  },
  actions: {
    Login({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post("/login", payload)
          .then((res) => {
            if (res.status === 200) {
              commit("setLoginData", res.data.token);
            } else {
              commit("setLoginError", res.data.data);
            }
            resolve("/listing");
          })
          .catch((err) => {
            if (err.status === 400) {
              commit("setLoginError", err.data.error);
            }
            reject(err);
          });
      });
    },
  },
};
