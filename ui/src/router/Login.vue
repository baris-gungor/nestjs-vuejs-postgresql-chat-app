<template>
  <div class="sc-login-container">
    <v-form validate-on="submit" @submit="reqLogin">
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
      <v-btn type="submit" block class="mt-2">Submit</v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},
  data: () => ({
    apiUrl: 'http://localhost:3000',
    userName: '',
    password: '',
    rules: {
      required: (value) => !!value || 'Required.',
      min: (v) => v.length >= 6 || 'Min 6 characters',
    },
    timeout: null,
  }),
  created() {},
  computed: {},
  methods: {
    async reqLogin() {
      if (this.userName.length > 1 && this.password.length > 1) {
        const url = `${this.apiUrl}/users`;
        const data = {
          username: this.userName,
          password: this.password,
        };
        const req = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        await fetch(url, req)
          .then((response) => response.json())
          .then((data) => {
            // console.log('user durum:', data);
            if (data.loginSuccess) {
              window.localStorage.setItem(
                'session',
                JSON.stringify({
                  username: this.userName,
                  updateDate: data.updateDate,
                }),
              );
              window.location.reload();
            }else{
              alert("Username or password is incorrect!")
            }
          });
      }
    },
  },
};
</script>
<style lang="scss">
.sc-login-container {
  width: 50%;
  margin: 5% auto;
}
</style>
