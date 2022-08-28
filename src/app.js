const express = require('express');
const volleyball = require('volleyball');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
require("./config/passport/index");
require("./config/db");

const app = express();

const apiRouter = require("./routes/api");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use(volleyball);
app.use(helmet());
app.use(cors({ origin: '*' }));

app.use("/api/v1", apiRouter);

app.use(errorHandler);

module.exports = app;
