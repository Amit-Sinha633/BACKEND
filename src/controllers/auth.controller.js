import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken(user._id);
    const refreshToken = user.generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return res.status(400).json({
      msg: "Something went wrong while generating access and refresh token",
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { userName, email, password, phoneNumber } = req.body;

    if (!userName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        msg: "User already exist please logIn",
      });
    }
    const newUser = await User.create({
      userName,
      email,
      password,
      phoneNumber,
    });
    return res.status(200).json({
      msg: "User registered succesfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Somthoing went wrong while registaring the user",
    });
  }
};

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        msg: "user with email does not exist",
      });
    }
    const correctPassword = await existingUser.isPasswordCorrect(password);
    if (!correctPassword) {
      return res.status(200).json({
        msg: "User with email and password does not exist",
      });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existingUser._id,
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        msg: "User loggedIn successfully",
        user: existingUser,
      });
  } catch (error) {
    return res.status(400).json({
      msg: "Something went wrong while login",
    });
  }
};

const logOutUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true },
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .clearCookie("accessToken",undefined, options)
      .clearCookie("refreshToken", undefined,options)
      .status(200)
      .json({
        msg: "User loggedOut successfully",
        user: req.body.userName,
      });
  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong while logout",
    });
  }
};
export { registerUser, logInUser, logOutUser };
