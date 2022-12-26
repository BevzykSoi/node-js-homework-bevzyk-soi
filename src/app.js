const express = require('express');
const volleyball = require('volleyball');
const helmet = require('helmet');
const cors = require('cors');
const path = require("path");
require('dotenv').config();
require("./config/passport/index");
require("./config/db");

const app = express();

const staticFolderPath = path.join(process.cwd(), "public");

const apiRouter = require("./routes/api");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.static(staticFolderPath));
app.use(express.json());
app.use(volleyball);
app.use(helmet());
app.use(cors({ origin: '*' }));

app.use("/api/v1", apiRouter);

app.use(errorHandler);

module.exports = app;