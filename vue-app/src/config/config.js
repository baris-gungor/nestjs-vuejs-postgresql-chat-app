const config = {
  apiBaseUrl: process.env.VUE_APP_API_HOST,
  apiPort: process.env.VUE_APP_API_PORT,
  apiUrl: `http://${process.env.VUE_APP_API_HOST}:${process.env.VUE_APP_API_PORT}`,
  webSocketUrl: `ws://${process.env.VUE_APP_API_HOST}:${process.env.VUE_APP_API_PORT}`,
};

export default { config };
