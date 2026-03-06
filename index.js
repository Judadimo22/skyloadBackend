const express = require("express");
require("dotenv").config()
const app = express();
const path = require("path");
const morgan = require("morgan");
const { MONGODB } = require("./db");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload")
const cors = require("cors");
app.use(cors());
const port = process.env.PORT || 3002;
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Skyload");
});

MONGODB();

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

module.exports = app;