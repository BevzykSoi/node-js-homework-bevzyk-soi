const express = require("express");

const contactsRouter = require("./contactsRouter");

const router = express.Router();

router.use("/contacts", contactsRouter);

module.exports = router;