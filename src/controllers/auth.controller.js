import { Contest } from "../models/contest.model.js";
import { User } from "../models/user.model.js";
import nodemailer from "nodemailer";
import { Participate } from "../models/perticipate.model.js";
import { Team } from "../models/team.model.js";
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
      data: newUser
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong while registaring the user",
      error
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
    console.log(correctPassword)
    if (!correctPassword) {
      return res.status(400).json({
        msg: "User with email and password does not exist",
      });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      existingUser._id,
    );
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        msg: "User loggedIn successfully",
        user: existingUser,
        role:existingUser.role,
        accessToken,     
    refreshToken
      });
  } catch (error) {
    return res.status(400).json({
      msg: "Something went wrong while login"     
    });
  }
};

const logOutUser = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 }, 
      },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    return res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .status(200)
      .json({
        msg: "User logged out successfully",
      });

  } catch (error) {
    console.error(error); // 🔥 IMPORTANT for debugging
    return res.status(500).json({
      msg: "Something went wrong while logout",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await req.user;
    return res.status(200).json({
      message: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal surver error",
    });
  }
};

const forgetPassword = async (req, res) => {
  const email = req.body.email;
  console.log(email)
  if (!email) {
    return res.status(400).json({
      msg: "email is required",
    });
  }
  const existigUser = await User.findOne({ email });
  console.log(existigUser)
  if (!existigUser) {
    return res.status(400).json({
      msg: "user not exist please register the user",
    });  
  }
  const { unhashedToken, hashedToken, tokenExpiary } =
      await existigUser.generateTemporaryToken();
    existigUser.forgetToken = hashedToken;
    existigUser.forgetTokenExpiary = tokenExpiary;
    await existigUser.save({ validateBeforeSave: false });
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USER_NAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });
      const mailtrapOptions = {
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: existigUser.email,
        subject: "Reset Password Request",
        text: `Please use the following link to reset your password : ${process.env.BASE_URL}/app/v1/Learn/forget-password/${unhashedToken}. \n\n This link will expire in 20 minutes. \n\n If you didn't requested to reset your password then please ignore this message`,
      };
      await transporter.sendMail(mailtrapOptions);
      return res.status(200).json({
        msg: `Email send successfully to ${existigUser.email}`
      })
    } catch (error) {
      return res.status(500).json({
        msg: "something went wrong while using forgetPassword",
      });
    }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!token) {
    return next(
      new ApiError(400, "Sorry, the Token is either Invalid or expired")
    );
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    forgetToken: hashedToken,
    forgetTokenExpiary: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ApiError(
        400,
        "Sorry, user not found, the Token is either Invalid or expired"
      )
    );
  }

  if (password !== confirmPassword) {
    return next(
      new ApiError(400, "Password and Confirm Password should be same")
    );
  }

  user.password = password;
  user.forgetToken = undefined;
  user.forgetTokenExpiary = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Password has been reset successfully"));
};

const getAllContest = async(req,res) => {
  const contests = await Contest.find()
  return res.status(200).json({
    msg: "these are your contests",
    data: contests
  })
}

const getAllUsers = async(req,res) =>{
 try {
  const users = await User.find()
  return res.status(200).json({
    msg: users
  })
 } catch (error) {
  return res.status(500).json({
    msg: "Something went wrong from server"
  })
 }
}

const deleteUser = async(req,res) =>{
  try {
    const {id} = req.params
    const user = await User.findByIdAndDelete(id)
    if(!user){
      return res.status(400).json({
        msg: "No user found"
      })
    }
    return res.status(200).json({
      msg: "User deleted Successfully",
      data: user
    })
    
  } catch (error) {
    return res.status(500).json({
    msg: "Something went wrong from server"
  })
  }
}

const updateUser = async(req,res) =>{
  try {
    const {id} = req.params
    const updatedThings ={
      userName : req.body.userName,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role
    }
    const newUser = await User.findByIdAndUpdate(
      id,
      updatedThings,
      {returnDocument:"after"}
    )
    if(!newUser){
      return res.status(400).json({
        msg: "No user found"
      })
    }
    return res.status(200).json({
      msg: "User updated successfully",
      data: newUser
    })
  } catch (error) {
    return res.status(500).json({
      msg: "Something went wrong from surver"
    })
  }
} 

const perticipatedIn = async(req,res) =>{
  const userId = req.user._id
  if(!userId){
    return res.status(400).josn({
      mag: "no user found"
    })
  }
 const perticipatesIn = await Team.find({
  $or: [
    { members: { $in: [req.user._id] } },
    { createdTeamBy: req.user._id }
  ]
});

const teamIds = perticipatesIn.map(team => team._id);
const allPericipates = await Participate.find({
  team:teamIds
})
const contestIds = allPericipates.map(perticipates=>perticipates.contest)
const contests = await Contest.find({
  _id:contestIds
})
const contestNames = contests.map(name=>name.title)
return res.status(200).json({
  msg: contestNames
})
}

export { registerUser, logInUser, logOutUser, getProfile, forgetPassword,resetPassword,getAllContest,getAllUsers,deleteUser,updateUser,perticipatedIn};
