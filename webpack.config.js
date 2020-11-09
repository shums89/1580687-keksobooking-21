const path = require("path");

module.exports = {
  entry: [
    "./js/utils.js",
    "./js/network.js",
    "./js/filter.js",
    "./js/data.js",
    "./js/pin.js",
    "./js/card.js",
    "./js/map.js",
    "./js/form.js",
    "./js/modals.js",
    "./js/main.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
}
