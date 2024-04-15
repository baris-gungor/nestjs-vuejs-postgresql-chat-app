import { io } from "socket.io-client";
import config from "../config/config";

class SocketIoService {
  socket;
  constructor() {}
  setupSocketConnection() {
    const { apiUrl } = config.config;
    const uri = `${apiUrl !== "/" ? apiUrl : ""}/chat`;
    const path = "";
    const autoConnect = true;
    const forceNew = true;
    const transports = ["websocket"];
    const reconnection = true;
    const opts = {
      path,
      autoConnect,
      forceNew,
      transports,
      reconnection,
    };
    this.socket = io(uri, opts);
    return this.socket;
  }
}

export default new SocketIoService();
