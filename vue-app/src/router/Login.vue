<template>
  <div class="sc-login-container">
    <v-form v-if="login" validate-on="submit" @submit="reqLogin">
      <h1>Please Login</h1>
      <v-text-field
        v-model="userName"
        :rules="[rules.required, rules.min]"
        label="Username"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="[rules.required, rules.min]"
        type="password"
        label="Password"
      ></v-text-field>
      <v-btn type="submit" class="mt-2">Submit</v-btn
      ><v-btn type="button" class="mt-2" @click="signUpForm">Sign Up</v-btn>
    </v-form>
    <v-form v-if="!login" validate-on="submit" @submit="reqSignUp">
      <h1>Please Sign Up</h1>
      <v-text-field
        v-model="userName"
        :rules="[rules.required, rules.min]"
        label="Username"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="[rules.required, rules.min]"
        type="password"
        label="Password"
      ></v-text-field>
      <v-btn type="submit" class="mt-2">Submit</v-btn
      ><v-btn type="button" class="mt-2" @click="loginForm">Login</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data: () => ({
    apiUrl: "http://localhost:3000",
    userName: "",
    password: "",
    login: true,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 6 || "Min 6 characters",
    },
    timeout: null,
  }),
  created() {},
  computed: {},
  methods: {
    async reqLogin() {
      if (this.userName.length > 1 && this.password.length > 1) {
        const url = `${this.apiUrl}/users/login`;
        const data = {
          username: this.userName,
          password: this.password,
        };
        const req = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODUwMjMsImV4cCI6MTcwMzY4ODYyM30.0f2e5j9DSWjdttKspU0pjCh_sBJaWzvp_KD1K6mIc5c",
          },
          body: JSON.stringify(data),
        };
        await fetch(url, req)
          .then((response) => response.json())
          .then((data) => {
            // console.log('user durum:', data);
            if (data.loginSuccess) {
              window.localStorage.setItem(
                "session",
                JSON.stringify({
                  username: this.userName,
                  updateDate: data.updateDate,
                })
              );
              window.location.reload();
            } else {
              alert("Username or password is incorrect!");
            }
          });
      }
    },
    async reqSignUp() {
      if (this.userName.length > 1 && this.password.length > 1) {
        const url = `${this.apiUrl}/users/adduser`;
        const data = {
          username: this.userName,
          password: this.password,
        };
        const req = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };
        await fetch(url, req)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // console.log('user durum:', data);
            if (data.id) {
              this.loginForm;
              alert("Successfully signed in! Please now login");
            } else {
              alert("Something went wrong!");
            }
          });
      }
    },
    async signUpForm() {
      this.login = false;
      this.userName = "";
      this.password = "";
    },
    async loginForm() {
      this.login = true;
      this.userName = "";
      this.password = "";
    },
  },
};
</script>
<style lang="scss">
.sc-login-container {
  width: 50%;
  margin: 10% auto;
  border: 1px solid #00000040;
  padding: 20px;
  border-radius: 12px;
}
</style>
