import { upsertStreamuser } from "../lib/stream.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../unit/sendMail.js";
import { log } from "console";

export async function signUp(req, resp) {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      return resp.status(400).json({ message: "All Field Is Required" });
    }

    if (password.length < 6) {
      return resp
        .status(400)
        .json({ message: "password must be latest 6 character" });
    }

    const regX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!regX.test(email)) {
      return resp.status(401).json({ message: "Invalid Email Formet" });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return resp
        .status(400)
        .json({ message: "Email Already Exists ! Try With Differnt One" });
    }

    const randomCount = Math.floor(Math.random() * 100 + 1);

    const randomPic = `https://avatar.iran.liara.run/public/${randomCount}`;

    const newUser = await User.create({
      fullname,
      email,
      password,
      profilePics: randomPic,
    });

    const isUser = await User.findById(newUser._id).select("-password");

    try {
      await upsertStreamuser({
        id: newUser._id,
        name: newUser.fullname,
        image: newUser.profilePics || "",
      });
      console.log("new stream user created", newUser.fullname);
    } catch (error) {
      console.error("Error upserting Stream user", error);
    }

    const jwtToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECERT, {
      expiresIn: "7d",
    });

    return resp
      .status(201)
      .cookie("Jwt", jwtToken, {
        httpOnly: true,
        sercure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({
        success: true,
        user: isUser,
      });
  } catch (error) {
    console.log("Error in SignUp Controller", error);
    return resp
      .status(500)
      .json({ message: "SomeTHing went Wrong While Create a user" });
  }
}

export async function Login(req, resp) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({ message: "All Field Is Required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return resp.status(400).json({ message: "Invalid Email And Password" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return resp.status(400).json({ message: "Incorrect Password" });
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECERT, {
      expiresIn: "7d",
    });

    const loggeduser = await User.findById(user._id).select("-password");

    return resp
      .status(202)
      .cookie("Jwt", jwtToken, {
        httpOnly: true,
        sercure: process.env.NODE_ENV === "production" || true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({
        success: true,
        userId: loggeduser,
        message: "Login SuccesFully",
      });
  } catch (error) {
    console.log("Error in Login Controller", error);
    return resp
      .status(500)
      .json({ message: "Something went Wrong While Loggin A User" });
  }
}

export async function Logout(req, resp) {
  return resp.status(201).clearCookie("Jwt").json({
    success: true,
    message: "Logout SuccesFully",
  });
}

export async function onBoard(req, resp) {
  try {
    const userId = req.user._id;

    const { fullname, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullname ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return resp.status(400).json({
        message: "All Field Is Required",
        missibgFields: [
          !fullname && "fullname",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnBoarded: true,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return resp.status(404).json({ message: "User Not Found" });
    }

    try {
      await upsertStreamuser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullname,
        image: updatedUser.profilePics || "",
      });
      // console.log('upsertStreamuser',updatedUser.fullname);
    } catch (error) {
      console.error("Upsert Stream Error", error);
    }

    return resp.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in OnBoard Controller", error);
    return resp
      .status(500)
      .json({ message: "Something went Wrong While OnBoarding A User" });
  }
}

export async function getUser(req, resp) {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return resp.status(404).json({ message: "User Not Found" });
    }

    const userInfo = await User.findById(userId).select("-password");

    return resp
      .status(200)
      .json({ message: "User get SuccesFully", user: userInfo });
  } catch (error) {
    console.log("Error in getUser Controller", error);
    return resp
      .status(500)
      .json({ message: "Something went Wrong While get a user" });
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email);
    

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const Expire = Date.now() + 5 * 60 * 1000; // 10 min

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
    await user.save()

    // create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // send email
    const sending = await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: `You requested a password reset. Click here: ${resetUrl}`,
    });

    console.log(sending);
    

    res
      .status(200)
      .json({ message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // from reset link
    const  {password}  = req.body;


    console.log(password)

    // hash token and compare
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    console.log(user);
    

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // update password
    user.password = password; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
