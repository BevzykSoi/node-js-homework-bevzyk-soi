const express = require('express');
const multer = require("multer");
const path = require("path");

const router = express.Router();

const { auth } = require("../middlewares");
const { register, login, logout, current, updateSubscription, updateAvatar } = require("../controllers/usersController");
const schemaValidate = require("../middlewares/schemaValidate");
const usersValidators = require("../validators/users");

const tmpPath = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpPath);
  },
  filename: (req, file, cb) => {
    const newFileName = `${new Date().getTime()}_${file.originalname}`;
    cb(null, newFileName);
  },
});

const upload = multer({
  storage,
});

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/current", auth, current);
router.patch("/", schemaValidate(usersValidators.updateSubscription), auth, updateSubscription);
router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

module.exports = router;