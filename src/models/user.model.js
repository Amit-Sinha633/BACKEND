import mongoose, { model, Schema } from "mongoose";
import crypto from "crypto"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    forgetToken: {
      type: String,
    },
    forgetTokenExpiary: {
      type: Date,
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIARY,
  });
};

userSchema.methods.generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIARY,
  });
};

userSchema.methods.generateTemporaryToken = function(){
  const unhashedToken = crypto.randomBytes(20).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex")
  const tokenExpiary = Date.now() + 20*60*1000
  return {unhashedToken,hashedToken,tokenExpiary}
}

const User = model("User", userSchema);
export { User };
