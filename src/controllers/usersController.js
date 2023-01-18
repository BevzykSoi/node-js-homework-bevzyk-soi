const { User } = require("../models");
const transport = require("../config/emailTransport");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const fs = require("fs").promises;
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const path = require("path");

exports.register = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      res.status(409).send("Email in use!");
      return;
    }

    const verificationToken = await nanoid();

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      subscription,
      verificationToken,
    });

    user.avatarURL = gravatar.url(email);

    const newToken = jwt.generate(user.id);
    user.token = newToken;
    await user.save();

    await transport.sendMail({
      from: `"Verify your email" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email verification link",
      text: `Hello! Please, confirm your email with this link: http://localhost:${process.env.PORT}/api/v1/users/verify/${verificationToken}`,
      html: `<h1>Hello! Please, confirm your email with this link:</h1><br></br><h3><a href="http://localhost:${process.env.PORT}/api/v1/users/verify/${verificationToken}">Verify email</a></h3>`,
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
        verificationToken: user.verificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(401).send("Email or password is wrong!");
      return;
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      res.status(401).send("Email or password is wrong!");
      return;
    }

    if (!user.verify) {
      res.status(401).send("You must verify your email first!");
      return;
    }

    const token = jwt.generate(user.id);
    user.token = token;

    await user.save();

    return res.status(200).json({
      token: user.token,
      user: {
        id: user.id,
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send("Not authorized!");
    }

    req.user.token = null;
    await req.user.save();

    res.status(204).send("You've been logged out succesully!");
  } catch (error) {
    next(error);
  }
};

exports.current = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).send("Not authorized!");
    }

    res.json({
      id: req.user.id,
      email: req.user.email,
      subscription: req.user.subscription,
      avatarURL: req.user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        subscription,
      },
      {
        new: true,
      }
    );

    if (!user) {
      res.status(404).send("User not found!");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    const avatarsPath = path.join(process.cwd(), "public/avatars");

    const uploadedImage = await Jimp.read(req.file.path);
    const editedImagePath = path.join(avatarsPath, req.file.filename);
    await uploadedImage
      .resize(250, 250)
      .quality(50)
      .writeAsync(editedImagePath);
    await fs.unlink(req.file.path);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: `/avatars/${req.file.filename}`,
      },
      {
        new: true,
      }
    );

    if (!user) {
      res.status(404).send("User not found!");
    }

    res.json({
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
      res.status(404).send("User not found!");
    }

    if (verificationToken !== user.verificationToken) {
      res.status(401).send("Invalid verification token!");
      return;
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        verificationToken: "-",
        verify: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      "message": "Verification successful!",
    });
  } catch (error) {
    next(error);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).send("Missing required field 'email'!");
      return;
    }

    const user = await User.findOne({ email });

    if (user.verify) {
      res.status(400).send("Verification is already passed!");
      return;
    }

    const verificationToken = await nanoid();

    await transport.sendMail({
      from: `"Verify your email" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Email verification link",
      text: `Hello! Please, confirm your email with this link: http://localhost:${process.env.PORT}/api/v1/users/verify/${verificationToken}`,
      html: `<h1>Hello! Please, confirm your email with this link:</h1><br></br><h3><a href="http://localhost:${process.env.PORT}/api/v1/users/verify/${verificationToken}">Verify email</a></h3>`,
    });

    await User.findByIdAndUpdate(
      user._id,
      {
        verificationToken,
        verify: false,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      "message": "Verification link is sent!",
    });
  } catch (error) {
    next(error);
  }
};
