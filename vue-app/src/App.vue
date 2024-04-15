<template>
  <Mainframe v-if="isLogin == true" />
  <Login v-else />
</template>

<script>
import Mainframe from './router/Mainframe.vue';
import Login from './router/Login.vue';
export default {
  name: 'App',
  components: { Mainframe, Login },
  data() {
    return {
      isLogin: false,
      auth: null,
    };
  },
  created() {
    this.auth = JSON.parse(window.localStorage.getItem('session'));
    if (this.auth) {
      if (!this.auth.username) {
        // alert('Please login');
      } else {
        let updateDate = Date.parse(this.auth.updateDate);
        let dateVal = new Date();
        let nowDate = Date.parse(dateVal);
        let difference = nowDate - updateDate;
        let seconds = difference / 1000; //how many seconds
        let minutes = seconds / 60; //how many minutes
        // console.log('minutes: ', minutes);
        let hours = minutes / 60; //how many hours
        if (minutes > 180) {
          window.localStorage.setItem('session', JSON.stringify({}));
        } else {
          this.isLogin = true;
        }
      }
    }
  },
};
</script>
<style lang="scss">
:root {
  --primaryBack: #eeeeee;
  --secondaryBack: white;
  --thirdBack: white;
  --fourthBack: #cacaca;
  --buttonText: #404258;
}

[theme='dark'] {
  --primaryBack: #404258;
  --secondaryBack: #474e68;
  --thirdBack: #50577a;
  --fourthBack: #6b728e;
  --buttonText: rgba(255, 255, 255, 0.845);
}

// [theme="light"] {
//   --primaryBack: transparent;
//   --secondaryBack: transparent;
// }
::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0px 0px 16px 0px rgb(0 0 0 / 30%);
  background-color: var(--primaryBack);
}

::-webkit-scrollbar {
  width: 10px;
  background-color: var(--primaryBack);
}

::-webkit-scrollbar-thumb {
  background-color: var(--fourthBack);
  border: 1px solid #55555500;
  border-radius: 10px;
}
</style>
