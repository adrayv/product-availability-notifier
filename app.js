require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3002;
const simpleAuth = require("./middleware/simpleAuth");
const requestLogger = require("./middleware/requestLogger");
const jsonParser = bodyParser.json();
const router = require("./router");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  console.error("FAILED REQ HEADERS", req.headers);
  console.error("FAILED REQ BODY", req.body);
  return res.status(500).send("Server Error");
};

app.use(cors(), simpleAuth, jsonParser, requestLogger, router, errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
