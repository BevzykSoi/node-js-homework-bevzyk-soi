const { Schema, model } = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: String,
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.statics.hashPassword = function (prevPassword) {
    return bcrypt.hash(prevPassword, 12);
}

userSchema.methods.validatePassword = function (prevPassword) {
    const hashedPassword = this.password;
    return bcrypt.compare(prevPassword, hashedPassword);
};

module.exports = model('user', userSchema);