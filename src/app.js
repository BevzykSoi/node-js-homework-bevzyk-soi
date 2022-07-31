const express = require('express');
const volleyball = require('volleyball');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const apiRouter = require("./routes/api");
const errorHandler = require("./middlewares/errorHandler");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Database connection successful!'))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(volleyball);
app.use(helmet());
app.use(cors({ origin: '*' }));

app.use("/api/v1", apiRouter);

app.use(errorHandler);

module.exports = app;
