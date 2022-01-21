import webpack from "webpack";
import config from "../webpack.config";
const express = require("express");
const path = require("path");
const open = require("open");
const port = 3000;
const app = express();
const compiler = webpack(config);
app.use(
  require("webpack-dev-middleware")(compiler, {
    publicPath: config.output.publicPath,
  })
);
app.use("/images", express.static(path.join(__dirname, "..", "images")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../src/index.html"));
});
app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    open("http://localhost:" + port);
  }
});
