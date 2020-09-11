// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set("@styles", path.resolve(__dirname, "src/styles"));
  }
};
