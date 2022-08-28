const express = require('express');

const router = express.Router();

const { auth } = require("../middlewares");
const { register, login, logout, current, updateSubscription } = require("../controllers/usersController");
const schemaValidate = require("../middlewares/schemaValidate");
const usersValidators = require("../validators/users");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/current", auth, current);
router.patch("/", schemaValidate(usersValidators.updateSubscription), auth, updateSubscription);

module.exports = router;