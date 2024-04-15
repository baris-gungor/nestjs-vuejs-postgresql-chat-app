const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
});
// module.exports = {
//   devServer: {
//     host: process.env.API_HOST || "localhost",
//     open: true,
//     port: process.env.API_PORT || 3000,
//   },
// };
