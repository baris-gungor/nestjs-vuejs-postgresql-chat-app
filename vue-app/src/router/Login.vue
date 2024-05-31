<template>
  <div class="sc-login-container">
    <v-form v-if="login" validate-on="submit" @submit="reqLogin">
      <h1>Please Login</h1>
      <v-text-field
        v-model="username"
        :rules="[rules.required, rules.min]"
        label="username"
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
        v-model="username"
        :rules="[rules.required, rules.min]"
        label="username"
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="[rules.required, rules.min]"
        type="password"
        label="Password"
      ></v-text-field>
      <v-btn type="submit" class="mt-2">Submit</v-btn>
      <v-btn type="button" class="mt-2" @click="loginForm">Login</v-btn>
    </v-form>
    <v-btn type="button" class="mt-2" @click="loginGithub">
      Login with Github
    </v-btn>
  </div>
</template>

<script>
import SocketIoService from "../services/socketio.service";
import config from "../config/config";

export default {
  name: "Login",
  components: {},
  data: () => ({
    apiUrl: "http://localhost:3000",
    username: "",
    password: "",
    login: true,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => v.length >= 6 || "Min 6 characters",
    },
    timeout: null,
    githubUrl: "",
    webSocket: null,
  }),
  async created() {
    if (config && config.config) {
      const { apiUrl } = config.config;
      this.apiUrl = apiUrl;
    }
    this.webSocket = SocketIoService.setupSocketConnection();
    // this.webSocket.on("newEvent", (message) => {
    //   // console.log("mess", message);
    //   window.localStorage.setItem(
    //     "session",
    //     JSON.stringify({
    //       ...message,
    //     })
    //   );
    // });
  },
  computed: {},
  methods: {
    async reqLogin() {
      if (this.username.length > 1 && this.password.length > 1) {
        const url = `${this.apiUrl}/users/login`;
        const data = {
          username: this.username,
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
                  username: this.username,
                  updateDate: data.updateDate,
                })
              );
              window.location.reload();
            } else {
              alert("username or password is incorrect!");
            }
          });
      }
    },

    async reqSignUp() {
      if (this.username.length > 1 && this.password.length > 1) {
        const url = `${this.apiUrl}/users/add`;
        const data = {
          username: this.username,
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
            // console.log(data);
            // console.log("user durum:", data);
            if (data && data.status == true) {
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
      this.username = "";
      this.password = "";
    },

    async loginForm() {
      this.login = true;
      this.username = "";
      this.password = "";
    },

    async loginGithub() {
      const url = `${this.apiUrl}/users/github-login`;
      const req = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      await fetch(url, req)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.code == 200) {
            this.githubUrl = data.loginUrl;
            window.location.href = this.githubUrl;
          }
        });
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
