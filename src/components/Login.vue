<template>
  <div class="home">
    <form @submit.prevent="login">
      <div class="bg-danger text-white pl-3 my-2 py-1 live-error" v-if="error">
        {{ error }}
      </div>
      <div
        class="bg-danger text-white pl-3 my-2 py-1 live-error"
        v-if="errorGetter"
      >
        {{ errorGetter }}
      </div>
      <input type="email" class="form-control mb-3" v-model="loginData.email" />
      <div
        v-show="emailValidationErr"
        class="live-error bg-danger text-white mb-2 p-1"
      >
        Email Not Valid
      </div>
      <input
        type="password"
        class="form-control mb-3"
        v-model="loginData.password"
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
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginData: {
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
          this.loginData.email
        ) && this.loginData.email.length > 0
      );
    },
    // Password Validation
    passwordValidationErr() {
      return (
        this.loginData.password.length > 0 && this.loginData.password.length < 6
      );
    },
    // Form Validation
    isValidForm() {
      return (
        this.loginData.password.length > 5 &&
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          this.loginData.email
        ) &&
        this.loginData.email.length > 0
      );
    },
  },
  methods: {
    login() {
      let { email, password } = this.loginData;
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
