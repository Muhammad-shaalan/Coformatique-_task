<template>
  <div class="home">
    <form @submit.prevent="register">
      <div class="bg-danger text-white pl-3 my-2 py-1 live-error" v-if="error">
        {{ error }}
      </div>
      <div
        class="bg-danger text-white pl-3 my-2 py-1 live-error"
        v-if="errorGetter"
      >
        {{ errorGetter }}
      </div>
      <input
        type="email"
        class="form-control mb-3"
        v-model="registerData.email"
      />
      <div
        v-show="emailValidationErr"
        class="live-error bg-danger text-white mb-2 p-1"
      >
        Email Not Valid
      </div>
      <input
        type="password"
        class="form-control mb-3"
        v-model="registerData.password"
      />
      <div
        v-show="passwordValidationErr"
        class="live-error bg-danger text-white mb-2 p-1"
      >
        Password Must be more than 6 chars or number
      </div>
      <input
        type="submit"
        class="btn btn-success"
        :disabled="!isValidForm"
        value="Login"
      />
    </form>
    <p class="mt-3">
      <router-link to="login" class="text-dark"
        >Don you have an account? Login</router-link
      >
    </p>
  </div>
</template>

<script>
import { ServiceFactory } from "../services/ServiceFactory";
const UsersService = ServiceFactory.get("Users");

export default {
  name: "Register",
  data() {
    return {
      registerData: {
        email: "",
        password: "",
      },
      error: false,
      success: false,
    };
  },
  computed: {
    // Error Login
    errorGetter() {
      return this.$store.getters.isError;
    },
    // Email Validation
    emailValidationErr() {
      return (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          this.registerData.email
        ) && this.registerData.email.length > 0
      );
    },
    // Password Validation
    passwordValidationErr() {
      return (
        this.registerData.password.length > 0 &&
        this.registerData.password.length < 6
      );
    },
    // Form Validation
    isValidForm() {
      return (
        this.registerData.password.length > 5 &&
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          this.registerData.email
        ) &&
        this.registerData.email.length > 0
      );
    },
  },
  methods: {
    async register() {
      if (this.registerData.email && this.registerData.password) {
        const formData = this.registerData;
        const registerUser = await UsersService.registerUser(formData);
        if (registerUser) {
          this.registerUser = {};
          this.$swal({
            position: "center",
            icon: "success",
            title: "Registeration Successfully",
            timer: 1500,
          });
          setTimeout(() => {
            this.login();
          }, 1600);
        } else {
          this.$swal({
            position: "center",
            icon: "error",
            title: "Error",
          });
        }
      } else {
        this.$swal({
          position: "center",
          icon: "error",
          title: "Please Fill All Fields",
        });
      }
    },
    login() {
      let { email, password } = this.registerData;
      this.$store.dispatch("Login", { email, password }).then((path) => {
        // If isset Error
        this.error = this.$store.getters.isError;
        // If No Error
        this.$router.push(path);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
form {
  width: 500px;
  margin: auto;
  margin-top: 50px;
  background: #313131;
  padding: 25px;
  border-radius: 10px;
}
</style>
