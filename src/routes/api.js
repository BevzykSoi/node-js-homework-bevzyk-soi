const express = require("express");

const contactsRouter = require("./contactsRouter");
const usersRouter = require("./usersRouter");

const router = express.Router();

router.use("/contacts", contactsRouter);
router.use("/users", usersRouter);

module.exports = router;