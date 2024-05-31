<template>
  <div class="sc-home-container">
    <v-card-title class="sc-title">
      <img :src="avatarUrl" alt="" style="width: 64px; height: 64px" />
      <span class="text-h2 text-center">Chat App</span
      ><v-btn @click="logout">Logout</v-btn>
    </v-card-title>
    <div class="sc-chat-container">
      <div class="sc-user-list">
        <v-card class="mx-auto">
          <v-list-item-content>
            <v-list-item-title v-for="item in userList" :key="item.id">
              <button @click="selectedUser(item.username)">
                {{ item.username }}
              </button>
            </v-list-item-title>
          </v-list-item-content>
        </v-card>
      </div>
      <div class="sc-msg-cont">
        <div class="sc-home-messagelist">
          <div
            class="sc-home-message pa-2 sc-home-received"
            :class="{
              'sc-home-sent': item.username === username,
              'sc-home-system': item.username === 'system',
            }"
            v-for="item in items"
            :key="item.id"
            outlined
            tile
            :id="item.id"
          >
            <strong style="color: blue">{{ item.username }}</strong>
            {{ item.text }}
            <p>{{ item.createdAt }}</p>
          </div>
        </div>
        <div v-if="userSelected">
          <v-textarea
            label="Write your message.."
            auto-grow
            outlined
            v-model="text"
            rows="1"
            row-height="15"
          ></v-textarea>
          <v-btn @click="sendMessage">Send</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocketIoService from "../services/socketio.service";
import config from "../config/config";
export default {
  name: "Home",
  components: {},
  data: () => ({
    apiUrl: "http://localhost:3000",
    dialog: false,
    users: [],
    text: "",
    webSocket: null,
    username: "",
    items: "",
    userList: [],
    userSelected: false,
    lastMessageId: 1,
    avatarUrl: "",
  }),
  created() {
    if (config && config.config) {
      const { apiUrl } = config.config;
      this.apiUrl = apiUrl;
    }
    const currentUser = JSON.parse(window.localStorage.getItem("session"));
    this.username = currentUser.username;
    this.avatarUrl = currentUser.avatarUrl;
    // console.log(this.avatarUrl);
    const header = {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODUwMjMsImV4cCI6MTcwMzY4ODYyM30.0f2e5j9DSWjdttKspU0pjCh_sBJaWzvp_KD1K6mIc5c",
    };
    const data = {
      method: "GET",
      headers: header,
    };
    fetch(this.apiUrl + "/users/allUsers", data)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((el) => {
          this.userList.push({ username: el.username, id: el.id });
        });
        this.userList = this.userList.filter((object) => {
          return object.username !== this.username;
        });
      });

    this.webSocket = SocketIoService.setupSocketConnection();
  },
  methods: {
    sendMessage() {
      let message = {
        username: this.username,
        text: this.text,
        sendTo: this.userSelected,
      };
      this.webSocket.emit("sendMessage", message);
      this.text = "";
      if (this.items[0].username == "system") {
        this.items.shift();
      }
      this.lastMessageId++;
      const messages = [
        ...this.items,
        {
          ...message,
          id: this.lastMessageId,
          createdAt: new Date().toISOString(),
        },
      ];
      this.items = messages;
      // console.log("item", this.lastMessageId);
      setTimeout(
        document.getElementById(Number(this.lastMessageId)).scrollIntoView(),
        1000
      );
    },

    logout() {
      window.localStorage.setItem(
        "session",
        JSON.stringify({
          username: "",
          updateDate: "",
        })
      );
      window.location.reload();
    },
    async selectedUser(data) {
      this.userSelected = data;
      const url = `${this.apiUrl}/chat/conversation`;
      const sendData = {
        username: this.username,
        sendTo: this.userSelected,
      };
      // console.log(sendData);
      const req = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODUwMjMsImV4cCI6MTcwMzY4ODYyM30.0f2e5j9DSWjdttKspU0pjCh_sBJaWzvp_KD1K6mIc5c",
        },
        body: JSON.stringify(sendData),
      };
      let messages = [];
      await fetch(url, req)
        .then((response) => response.json())
        .then((responseData) => {
          if (!responseData.length > 0) {
            messages.push({
              id: 1,
              sendTo: this.username,
              username: "system",
              text: "Henüz bu kişiyle mesajlaşmadınız.",
              createdAt: "",
            });
            this.lastMessageId = 1;
            this.items = messages;
          } else {
            responseData.forEach((el) => {
              messages.push(el);
              this.items = messages;
              this.lastMessageId = el.id;
              //
            });
          }
        })
        .catch((err) => console.error(err));
      this.webSocket.on("sendMessage", (message) => {
        this.selectedUser(this.userSelected);
        messages.push(message);
        this.items = messages;
      });
      setTimeout(
        document.getElementById(this.lastMessageId).scrollIntoView(),
        1000
      );
    },
  },
};
</script>
<style lang="scss">
.sc-home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: var(--buttonText);
}

.sc-home-message {
  max-width: 60%;
  border: 1px solid rgba(0, 0, 0, 0.267);
  border-radius: 10px;
}

.sc-home-received {
  background-color: rgb(244, 255, 162);
  margin: 3px auto 3px 3px;
}
.sc-home-sent {
  background-color: rgb(181, 255, 255);
  margin: 3px 3px 3px auto;
}
.sc-home-system {
  background-color: rgb(233, 233, 233);
  margin: 3px auto 3px auto;
}
.sc-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
.v-dialog {
  width: 700px !important;
  display: flex;
  max-height: 80% !important;
}
.sc-carousel {
  border-radius: 12px;
  border: 0.5px solid #0000004a;
  box-shadow: 0px 0px 10px -5px rgb(0 0 0 / 20%);
  padding: 0px 0px;
  .v-img {
    .v-image__image--cover {
      background-size: contain;
    }
  }
  .v-responsive {
    align-items: center;
    display: flex;
    margin: 0px auto !important;
  }
  .v-window__container {
    justify-content: center;
  }
  .v-carousel__controls {
    max-height: 10%;
    display: none;
    .v-btn--icon.v-size--small {
      height: 9px;
      width: 7px;
    }
    .v-item-group {
      display: flex;
      flex-wrap: wrap;
    }
    .v-btn--icon.v-size--small .v-icon,
    .v-btn--fab.v-size--small .v-icon {
      font-size: 6px !important;
    }
  }
}
.sc-card {
  display: flex !important;
  flex-wrap: wrap !important;
  width: 300px !important;
  max-width: 88% !important;
  justify-content: center;
  text-align: center;
  color: var(--buttonText) !important;
  background-color: var(--thirdBack) !important;
}
.sc-card-img {
  width: 100% !important;
  .v-image__image--cover {
    background-size: contain !important ;
  }
}
.sc-dialog-img {
  width: 350px;
}
.sc-card-desc {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  color: var(--buttonText) !important;
}
.sc-dialog-card {
  display: flex;
  padding: 16px;
  height: 100%;
  align-items: center;
  text-align: center;
  flex-direction: column;
  background-color: var(--secondaryBack) !important;
  color: var(--buttonText) !important;
  border-radius: 0px !important;
}
.sc-dialog-desc {
  padding: 0px 30px;
  font-size: 16px;
  text-align: center;
  color: var(--buttonText) !important;
}
.sc-chat-container {
  display: flex;
  width: 100%;
}
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
  border: 1px solid rgba(0, 0, 0, 0.241);
  border-radius: 10px;
  padding: 20px 5px;
}
.sc-user-list {
  width: 15%;
  height: 500px;
  box-shadow: none !important;
  margin: 0px 6px 0px 0px;
  button {
    font-size: 20px;
    height: 40px;
    width: 100%;
    background-color: rgb(255, 255, 255);
    margin: 4px 0px;
    border: 1px solid rgba(0, 0, 0, 0.241);
    border-radius: 10px;
    &:active,
    &:focus {
      background-color: rgba(0, 0, 0, 0.196);
    }
  }
}
.sc-msg-cont {
  width: 90%;
  height: 500px;
}
.sc-home-messagelist {
  width: 100%;
  height: 90%;
  max-height: 390px;
  overflow-y: scroll;
  scroll-behavior: smooth;
  overflow-anchor: auto;
  border: 1px solid rgba(0, 0, 0, 0.241);
  border-radius: 10px;
  padding: 20px 5px;
  margin: 0px 0px 4px 0px;
}
.sc-title {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}
@media (min-width: 0px) and (max-width: 320px) {
  /* Smartphones 0-320*/
  .sc-user-list {
    width: 45%;
    height: 500px;
  }
}
@media (min-width: 321px) and (max-width: 575px) {
  /* Smartphones 0-320*/
  .sc-user-list {
    width: 30%;
    height: 500px;
  }
}
@media (min-width: 576px) and (max-width: 1024px) {
  /* Smartphones 0-320*/
  .sc-user-list {
    width: 20%;
    height: 500px;
  }
}
</style>
