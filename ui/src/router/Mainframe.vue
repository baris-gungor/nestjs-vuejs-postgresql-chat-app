<template>
  <v-app id="inspire">
    <!-- <v-navigation-drawer
      class="sc-side-container"
      v-model="drawer"
      app
      v-if="menuVersion > window.width"
    >
      <div class="sc-side-nav">
        <div class="item">
          <div class="toggle-pill-bw">
            <input
              type="checkbox"
              id="pill2"
              name="pageTheme"
              v-model="darkMode"
            />
            <label for="pill2"></label>
          </div>
        </div>

      </div>
    </v-navigation-drawer> -->

    <v-app-bar class="sc-top-header" app>
      <!-- <v-app-bar-nav-icon
        class="sc-top-hamburger"
        @click="drawer = !drawer"
        v-if="menuVersion > window.width"
      ></v-app-bar-nav-icon> -->
      <div class="sc-top-nav">
        <div class="item">
          <div class="toggle-pill-bw">
            <input
              type="checkbox"
              id="pill2"
              name="pageTheme"
              v-model="darkMode"
            />
            <label for="pill2"></label>
          </div>
        </div>
        <!-- <v-btn
          class="ml-6"
          v-for="item in items"
          :key="item.title"
          link
          :to="item.to"
        >
          {{ item.title }}
        </v-btn> -->
      </div>
    </v-app-bar>

    <v-main class="main-container">
      <v-container>
        <v-sheet min-height="70vh" style="background: transparent" rounded="lg">
          <router-view />
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'Mainframe',
  components: {},
  data: () => ({
    darkMode: false,
    items: [
      {
        title: 'Dashboard',
        to: '/',
      },
    ],
    drawer: null,
  }),
  created() {
  },
  computed: {},
  methods: {
  },
  mounted() {
    let htmlElement = document.documentElement;
    let theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      htmlElement.setAttribute('theme', 'dark');
      this.darkMode = true;
    } else {
      htmlElement.setAttribute('theme', 'light');
      this.darkMode = false;
    }
  },

  watch: {
    darkMode: function () {
      let htmlElement = document.documentElement;
      if (this.darkMode) {
        localStorage.setItem('theme', 'dark');
        htmlElement.setAttribute('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
        htmlElement.setAttribute('theme', 'light');
      }
    },
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
.main-container {
  background-color: var(--primaryBack);
  border-color: var(--primaryBack);
}
.container {
  margin-top: 20px !important;
  background-color: var(--secondaryBack);
  border-color: var(--primaryBack);
  border-radius: 8px;
  height: 96%;
}
.sc-side-container {
  background-color: var(--secondaryBack) !important;
  border-color: var(--primaryBack) !important;
}
.sc-side-nav {
  display: flex;
  padding: 50px 30px;
  align-items: center;
  flex-direction: column;
  .v-btn {
    background-color: var(--thirdBack) !important;
    color: var(--buttonText) !important;
  }
  .theme--light.v-btn::before {
    opacity: 1 !important;
    background-color: transparent;
  }
}
.sc-top-header {
  background-color: var(--primaryBack) !important;
}
.sc-top-hamburger {
  color: var(--buttonText) !important;
}

.sc-top-nav {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  .v-btn {
    background-color: var(--thirdBack) !important;
    color: var(--buttonText) !important;
  }
  .theme--light.v-btn::before {
    opacity: 1 !important;
    background-color: transparent;
  }
}
.sc-home-container {
  background-color: var(--secondaryBack);
  border-color: var(--primaryBack);
  border: none;
  // border-radius: 8px;
}

.toggle-pill-bw input[type='checkbox'] {
  display: none;
}
.toggle-pill-bw input[type='checkbox'] + label {
  display: block;
  position: relative;
  width: 3em;
  height: 1.6em;
  margin-bottom: 20px;
  background-color: var(--secondaryBack);
  border: 1px solid var(--buttonText);
  border-radius: 1em;
  cursor: pointer;
  -webkit-transition: background 0.1s ease-in-out;
  transition: background 0.1s ease-in-out;
}
.toggle-pill-bw input[type='checkbox'] + label:before {
  content: '';
  display: block;
  width: 1.2em;
  height: 1.2em;
  border-radius: 1em;
  background-color: var(--buttonText);
  position: absolute;
  left: 0.2em;
  top: 0.2em;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.toggle-pill-bw input[type='checkbox']:checked + label {
  background: #40464a;
}
.toggle-pill-bw input[type='checkbox']:checked + label:before {
  left: 1.6em;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
